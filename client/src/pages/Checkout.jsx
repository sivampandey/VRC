import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice'
import { usePlaceOrderMutation, useCreateRazorpayOrderMutation, useVerifyPaymentMutation } from '../store/api/ordersApi'
import { selectCurrentUser } from '../store/authSlice'
import { useGetProfileQuery, useAddAddressMutation } from '../store/api/authApi'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/ui/ScrollReveal'

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)

  const currentUser = useSelector(selectCurrentUser)
  const { data: userProfile } = useGetProfileQuery(undefined, { skip: !currentUser })

  const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })
  const [guestEmail, setGuestEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [saveToProfile, setSaveToProfile] = useState(false)

  const [addAddress] = useAddAddressMutation()

  // Auto-fill logged in user email and name on load
  useEffect(() => {
    if (currentUser) {
      setGuestEmail(currentUser.email)
      setAddress(prev => ({ ...prev, name: currentUser.name || '' }))
    }
  }, [currentUser])

  // Auto-fill address form with default saved address if available
  useEffect(() => {
    if (userProfile && userProfile.addresses && userProfile.addresses.length > 0) {
      const defaultAddr = userProfile.addresses.find(a => a.isDefault) || userProfile.addresses[0]
      setSelectedAddressId(defaultAddr._id)
      setAddress({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        line1: defaultAddr.line1 || '',
        line2: defaultAddr.line2 || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        pincode: defaultAddr.pincode || ''
      })
    } else {
      setSelectedAddressId('new')
    }
  }, [userProfile])

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id)
    if (id === 'new') {
      setAddress({
        name: userProfile?.name || currentUser?.name || '',
        phone: userProfile?.phone || '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: ''
      })
      setSaveToProfile(true)
    } else {
      const selected = userProfile?.addresses?.find(a => a._id === id)
      if (selected) {
        setAddress({
          name: userProfile.name || '',
          phone: userProfile.phone || '',
          line1: selected.line1 || '',
          line2: selected.line2 || '',
          city: selected.city || '',
          state: selected.state || '',
          pincode: selected.pincode || ''
        })
      }
      setSaveToProfile(false)
    }
  }

  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation()
  const [createRazorpayOrder, { isLoading: isCreatingRzp }] = useCreateRazorpayOrderMutation()
  const [verifyPayment] = useVerifyPaymentMutation()

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleCheckout = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast.error('Your shopping bag is empty.')
      return
    }

    const orderPayload = {
      items: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
        price: item.salePrice || item.price
      })),
      shippingAddress: address,
      guestEmail: guestEmail || 'guest@vaishnavrug.com',
      paymentMethod,
      subtotal: cartTotal,
      shippingCharge: 0,
      discount: 0,
      total: cartTotal
    }

    try {
      // 1. Save the order in MongoDB
      const order = await placeOrder(orderPayload).unwrap()

      // If client checked "Save to profile", trigger background profile save
      if (currentUser && saveToProfile) {
        try {
          await addAddress({
            name: address.name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            label: 'Home'
          }).unwrap()
        } catch (addrErr) {
          console.warn('Silent address save failed:', addrErr)
        }
      }

      if (paymentMethod === 'cod') {
        dispatch(clearCart())
        toast.success('Order placed successfully (Cash on Delivery)!')
        navigate(`/order-success/${order.orderNumber}`)
      } else {
        // 2. Trigger Razorpay integration
        const rzpOrder = await createRazorpayOrder({ orderId: order._id }).unwrap()

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'Vaishnav Rug Collection',
          description: 'Luxury Handcrafted Rugs Checkout',
          image: '/images/vrc-logo.png',
          order_id: rzpOrder.id,
          handler: async (response) => {
            try {
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id
              }).unwrap()
              
              dispatch(clearCart())
              toast.success('Payment verified! Order placed successfully.')
              navigate(`/order-success/${order.orderNumber}`)
            } catch (err) {
              console.error(err)
              toast.error('Payment verification failed. Please contact showroom helpdesk.')
            }
          },
          prefill: {
            name: address.name,
            email: guestEmail,
            contact: address.phone
          },
          theme: { color: '#C9A56A' }
        }

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options)
          rzp.open()
        } else {
          toast.error('Razorpay checkout could not load. Please refresh and try again.')
        }
      }
    } catch (err) {
      console.error(err)
      toast.error(err.data?.message || 'Failed to place order.')
    }
  }

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })

  return (
    <>
      <Helmet>
        <title>Secure Checkout | Vaishnav Rug Collection</title>
        <meta name="description" content="Place shipping addresses and details to complete payment." />
      </Helmet>

      <div className="py-24 bg-offwhite min-h-screen text-left font-jost">
        <div className="container max-w-[900px] mx-auto px-4">
          
          <ScrollReveal direction="up" className="text-center mb-10">
            <span className="section-label">Insured Checkout</span>
            <h1 className="font-cormorant text-3xl md:text-4xl text-navy font-bold leading-tight">Secure Checkout</h1>
            <div className="divider-gold mt-6"><span className="divider-gold-diamond"></span></div>
          </ScrollReveal>

          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Cols: Shipping Details form */}
            <div className="lg:col-span-2 bg-white border border-border/40 p-6 md:p-8 space-y-6">
              <h3 className="font-cinzel text-xs font-bold text-navy uppercase tracking-wider border-b border-border/20 pb-3">
                Shipping Address
              </h3>

              {/* Saved Addresses Selector (if logged in and has addresses) */}
              {currentUser && userProfile?.addresses && userProfile.addresses.length > 0 && (
                <div className="space-y-3 pb-3">
                  <span className="block text-[10px] uppercase font-cinzel font-semibold text-[#7A7065] tracking-wider">
                    Select Shipping Address
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userProfile.addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr._id
                      return (
                        <button
                          key={addr._id}
                          type="button"
                          onClick={() => handleAddressSelect(addr._id)}
                          className={`p-4 text-left border text-xs transition duration-300 rounded-sm relative flex flex-col justify-between h-28 cursor-pointer ${
                            isSelected 
                              ? 'border-[#C9A56A] bg-[#FAF5F0]' 
                              : 'border-[#E0D5C8]/80 bg-white hover:border-[#C9A56A]/50'
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="bg-[#160400] text-[#C9A56A] font-cinzel text-[7px] font-bold px-2 py-0.5 uppercase tracking-widest">
                              {addr.label}
                            </span>
                            {isSelected && (
                              <i className="ti ti-check text-[#C9A56A] text-sm"></i>
                            )}
                          </div>
                          <div className="mt-2 text-[#160400] pr-4 w-full">
                            <p className="font-bold truncate">{addr.line1}</p>
                            <p className="text-[11px] text-[#7A7065] truncate">{addr.city}, {addr.state} – {addr.pincode}</p>
                          </div>
                        </button>
                      )
                    })}
                    
                    {/* Add New Address Option */}
                    <button
                      type="button"
                      onClick={() => handleAddressSelect('new')}
                      className={`p-4 text-center border text-xs transition duration-300 rounded-sm flex flex-col justify-center items-center h-28 cursor-pointer ${
                        selectedAddressId === 'new'
                          ? 'border-[#C9A56A] bg-[#FAF5F0]'
                          : 'border-[#E0D5C8]/85 bg-white hover:border-[#C9A56A]/50'
                      }`}
                    >
                      <i className="ti ti-plus text-[#C9A56A] text-lg mb-1.5"></i>
                      <span className="font-cinzel text-[9px] uppercase font-bold text-[#160400] tracking-wider">
                        Use New Address
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase font-cinzel font-bold text-navy mb-1.5">Recipient Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={address.name}
                    onChange={handleInputChange}
                    className="w-full bg-offwhite border border-border/60 p-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-bold text-navy mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={address.phone}
                    onChange={handleInputChange}
                    className="w-full bg-offwhite border border-border/60 p-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-bold text-navy mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-offwhite border border-border/60 p-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase font-cinzel font-bold text-navy mb-1.5">Flat, House no, Building, Street</label>
                  <input
                    type="text"
                    name="line1"
                    required
                    value={address.line1}
                    onChange={handleInputChange}
                    className="w-full bg-offwhite border border-border/60 p-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase font-cinzel font-bold text-navy mb-1.5">Landmark, Area, Colony (Optional)</label>
                  <input
                    type="text"
                    name="line2"
                    value={address.line2}
                    onChange={handleInputChange}
                    className="w-full bg-offwhite border border-border/60 p-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-bold text-navy mb-1.5">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleInputChange}
                    className="w-full bg-offwhite border border-border/60 p-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-bold text-navy mb-1.5">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={address.state}
                    onChange={handleInputChange}
                    className="w-full bg-offwhite border border-border/60 p-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-cinzel font-bold text-navy mb-1.5">Pincode (6 Digits)</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={address.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-offwhite border border-border/60 p-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Save Address to profile Checkbox (for authenticated users) */}
              {currentUser && (
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveToProfile"
                    checked={saveToProfile}
                    onChange={(e) => setSaveToProfile(e.target.checked)}
                    className="w-4 h-4 accent-[#C9A56A] border-[#E0D5C8] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="saveToProfile" className="text-xs text-[#7A7065] select-none cursor-pointer">
                    Save this address to my profile for future orders
                  </label>
                </div>
              )}

              {/* Payment Methods */}
              <div className="pt-4 border-t border-border/20 space-y-3.5">
                <h3 className="font-cinzel text-xs font-bold text-navy uppercase tracking-wider">
                  Payment Method
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="flex items-center gap-2 border border-border/60 p-4 flex-grow cursor-pointer bg-offwhite">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-gold"
                    />
                    <div>
                      <span className="block text-xs font-bold text-navy">Cash on Delivery</span>
                      <span className="text-[10px] text-muted">Pay at showroom dispatch (under ₹25,000)</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 border border-border/60 p-4 flex-grow cursor-pointer bg-offwhite">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-gold"
                    />
                    <div>
                      <span className="block text-xs font-bold text-navy">Razorpay Checkout</span>
                      <span className="text-[10px] text-muted">Pay via Cards, UPI, Netbanking</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right 1 Col: Summary & Buy button */}
            <div className="space-y-6">
              <div className="bg-white border border-border/40 p-6 space-y-4">
                <h3 className="font-cinzel text-xs font-bold text-navy uppercase tracking-wider border-b border-border/20 pb-3">
                  Summary
                </h3>
                
                <div className="max-h-[180px] overflow-y-auto divide-y divide-border/25 pr-2">
                  {cartItems.map((item) => (
                    <div key={`${item._id}-${item.size}`} className="py-2.5 flex items-center justify-between text-xs text-charcoal">
                      <div>
                        <span className="font-semibold block">{item.name}</span>
                        <span className="text-[10px] text-muted">Qty: {item.quantity} | Size: {item.size}</span>
                      </div>
                      <span className="font-semibold text-navy">
                        {inrFormatter.format((item.salePrice || item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-border/20 my-2"></div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold">{inrFormatter.format(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-navy font-bold">
                  <span>Grand Total</span>
                  <span className="text-gold-dark text-sm">{inrFormatter.format(cartTotal)}</span>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full py-3.5 uppercase font-bold"
                  disabled={isPlacingOrder || isCreatingRzp}
                >
                  {isPlacingOrder || isCreatingRzp ? 'Processing Order...' : 'Complete Payment'}
                </Button>
              </div>

              <div className="text-center">
                <Link to="/cart" className="text-xs font-cinzel text-gold hover:text-navy uppercase underline font-semibold">
                  Modify Shopping Bag
                </Link>
              </div>
            </div>

          </form>

        </div>
      </div>
    </>
  )
}
