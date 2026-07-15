import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout, selectCurrentUser } from '../../store/authSlice'
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../../store/api/productsApi'
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useGetAllCustomInquiriesQuery,
  useUpdateInquiryStatusMutation
} from '../../store/api/ordersApi'
import { useGetAllUsersQuery, useDeleteUserMutation } from '../../store/api/authApi'
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Check,
  Truck,
  Users,
  AlertTriangle,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Settings,
  Menu,
  X,
  Sparkles,
  Package
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import adminBgImg from '../../assets/admin_bg.jpg'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // Redirect to login if not authenticated — happens immediately on mount
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/admin', { replace: true })
    }
  }, [currentUser, navigate])

  // Queries — skip all heavy fetches if not admin
  const isAdmin = currentUser?.role === 'admin'
  const { data: productsData, refetch: refetchProducts } = useGetProductsQuery({ limit: 50 }, { skip: !isAdmin })
  const { data: orders, refetch: refetchOrders } = useGetAllOrdersQuery(undefined, { skip: !isAdmin })
  const { data: inquiries, refetch: refetchInquiries } = useGetAllCustomInquiriesQuery(undefined, { skip: !isAdmin })
  const { data: users, isError: usersError, isLoading: usersLoading } = useGetAllUsersQuery(undefined, { skip: !isAdmin })

  // Mutations
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const [updateOrderStatus] = useUpdateOrderStatusMutation()
  const [updateOrderTracking] = useUpdateOrderTrackingMutation()
  const [updateInquiryStatus] = useUpdateInquiryStatusMutation()
  const [deleteUser] = useDeleteUserMutation()

  // Inline forms state
  const [productForm, setProductForm] = useState({ name: '', sku: '', category: 'Traditional', price: '', description: '', sizes: '5x8 ft' })
  const [editingId, setEditingId] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [trackingState, setTrackingState] = useState({ orderId: '', trackingNumber: '', trackingUrl: '' })

  const handleProductSubmit = async (e) => {
    e.preventDefault()

    // Parse preset sizes chart
    const sizesArray = productForm.sizes.split(',').map(s => ({
      label: s.trim(),
      price: Number(productForm.price),
      stock: 5
    }))

    const payload = {
      name: productForm.name,
      slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: productForm.sku,
      category: productForm.category,
      price: Number(productForm.price),
      description: productForm.description,
      sizes: sizesArray,
      images: [{ url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800', alt: productForm.name }]
    }

    try {
      if (editingId) {
        await updateProduct({ id: editingId, ...payload }).unwrap()
        toast.success('Product updated successfully!')
      } else {
        await createProduct(payload).unwrap()
        toast.success('Product added to database!')
      }
      setProductForm({ name: '', sku: '', category: 'Traditional', price: '', description: '', sizes: '5x8 ft' })
      setEditingId(null)
      setShowProductForm(false)
      refetchProducts()
    } catch (err) {
      toast.error('Failed to save product.')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product from catalog?')) {
      try {
        await deleteProduct(id).unwrap()
        toast.success('Product deleted.')
        refetchProducts()
      } catch (err) {
        toast.error('Failed to delete product.')
      }
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus({ id, orderStatus: status }).unwrap()
      toast.success('Order status updated!')
      refetchOrders()
    } catch (err) {
      toast.error('Failed to change status.')
    }
  }

  const handleTrackingSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateOrderTracking({
        id: trackingState.orderId,
        trackingNumber: trackingState.trackingNumber,
        trackingUrl: trackingState.trackingUrl
      }).unwrap()
      toast.success('Tracking details attached!')
      setTrackingState({ orderId: '', trackingNumber: '', trackingUrl: '' })
      refetchOrders()
    } catch (err) {
      toast.error('Failed to attach tracking details.')
    }
  }

  const handleInquiryStatus = async (id, status) => {
    try {
      await updateInquiryStatus({ id, status }).unwrap()
      toast.success('Inquiry updated.')
      refetchInquiries()
    } catch (err) {
      toast.error('Failed to update inquiry.')
    }
  }

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      try {
        await deleteUser(id).unwrap()
        toast.success(`User account "${name}" deleted successfully.`)
      } catch (err) {
        toast.error(err.data?.message || 'Failed to delete user.')
      }
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out from admin console.')
    navigate('/login')
  }

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })

  // Calculate overview totals
  const totalRevenue = orders?.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.total : 0), 0) || 0

  // While redirecting (no user), show nothing
  if (!currentUser) return null

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-jost">
        <div className="text-center space-y-4 p-8 max-w-sm bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-[#8B1C1C]" />
          </div>
          <h2 className="font-cormorant text-3xl text-navy font-bold">Access Restricted</h2>
          <p className="text-sm text-[#7A7065]">You do not have administrator privileges. Contact the VRC support team to request permission.</p>
          <div className="pt-2 flex gap-3 justify-center">
            <button onClick={() => navigate('/')} className="bg-[#160400] text-[#FAF5F0] font-cinzel text-[10px] tracking-widest uppercase px-6 py-3 hover:bg-[#C9A56A] transition-colors rounded-sm font-semibold">
              Go Home
            </button>
            <button onClick={() => navigate('/account/profile')} className="border border-slate-200 text-navy font-cinzel text-[10px] tracking-widest uppercase px-6 py-3 hover:bg-slate-50 transition-colors rounded-sm font-semibold">
              My Account
            </button>
          </div>
          <p className="text-[10px] text-muted font-cinzel tracking-wider">Logged in as: {currentUser.email}</p>
        </div>
      </div>
    )
  }

  const sidebarLinks = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'products', name: 'Products Catalog', icon: ShoppingBag },
    { id: 'orders', name: 'Orders Management', icon: ClipboardList },
    { id: 'customs', name: 'Bespoke Requests', icon: MessageSquare },
    { id: 'users', name: 'User Accounts', icon: Users },
  ]

  return (
    <>
      <Helmet>
        <title>VRC Admin commands console | Vaishnav Rug Collection</title>
      </Helmet>

      {/* Blurred background image layer to avoid Chrome fixed backdrop bug */}
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${adminBgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.06)',
          zIndex: 0
        }}
      />
      {/* Main SaaS Dashboard Container Layout */}
      <div className="min-h-screen relative flex flex-col lg:flex-row font-jost text-slate-800 z-10 bg-transparent">

        {/* DESKTOP SIDEBAR - Sleek dark navy Stripe/Linear styling */}
        <aside className="hidden lg:flex w-[260px] bg-[#100301] text-[#d1d5db] shrink-0 flex-col justify-between border-r border-red-950/20 relative z-30">
          <div className="flex flex-col flex-grow">

            {/* Top brand header */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-red-950/20">
              <div className="p-1 bg-[#FAF5F0] border border-[#C9A56A]/30 flex items-center justify-center rounded">
                <Shield className="w-5 h-5 text-[#160400]" />
              </div>
              <div>
                <span className="font-cinzel text-xs font-bold text-[#FAF5F0] tracking-[0.15em] block leading-none">VAISHNAV</span>
                <span className="font-cinzel text-[7px] text-[#C9A56A] tracking-[0.25em] block mt-1 font-semibold leading-none">COMMAND CONSOLE</span>
              </div>
            </div>

            {/* Nav list */}
            <nav className="p-4 space-y-1.5 flex-grow">
              {sidebarLinks.map((link) => {
                const IconComp = link.icon
                const isActive = activeTab === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-150 cursor-pointer ${isActive
                      ? 'bg-[#C9A56A]/10 text-[#C9A56A] border-l-4 border-[#C9A56A]'
                      : 'hover:bg-white/5 hover:text-white text-slate-400'
                      }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-[#C9A56A]' : 'text-slate-400'}`} />
                    {link.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Bottom user dashboard profile block */}
          <div className="p-4 border-t border-red-950/20 bg-[#0b0200]/60 space-y-3">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-[#C9A56A]/15 border border-[#C9A56A]/30 flex items-center justify-center font-cinzel text-xs font-bold text-[#C9A56A] uppercase shrink-0">
                {currentUser?.name?.[0]}
              </div>
              <div className="min-w-0 flex-grow">
                <span className="block text-xs font-bold text-white truncate leading-tight">{currentUser?.name}</span>
                <span className="block text-[8px] font-cinzel text-[#C9A56A] tracking-widest uppercase mt-0.5">ADMIN</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-red-950/40 hover:border-red-900/40 hover:bg-red-950/20 py-2.5 rounded-lg text-[10px] font-cinzel font-semibold tracking-widest uppercase transition-colors text-slate-400 hover:text-red-400 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* MOBILE TOP NAVIGATION BAR & MENU HAMBURGER */}
        <header className="lg:hidden h-16 bg-[#100301] border-b border-red-950/20 flex items-center justify-between px-4 sticky top-0 z-[40]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#C9A56A]" />
            <span className="font-cinzel text-xs font-bold text-[#FAF5F0] tracking-wider">VRC COMMAND</span>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-white hover:text-[#C9A56A] p-1.5 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* MOBILE SIDEBAR DRAWER OVERLAY */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-[1000] lg:hidden flex justify-end">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />

            <div className="relative w-full max-w-[280px] h-full bg-[#100301] flex flex-col p-6 shadow-2xl z-10 text-[#d1d5db]">
              <div className="flex justify-between items-center pb-5 border-b border-red-950/20 mb-6">
                <span className="font-cinzel text-xs font-bold text-[#FAF5F0] tracking-[0.15em]">VRC COMMAND</span>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5 flex-grow">
                {sidebarLinks.map((link) => {
                  const IconComp = link.icon
                  const isActive = activeTab === link.id
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActiveTab(link.id)
                        setIsMobileSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-150 cursor-pointer ${isActive
                        ? 'bg-[#C9A56A]/10 text-[#C9A56A] border-l-4 border-[#C9A56A]'
                        : 'hover:bg-white/5 hover:text-white text-slate-400'
                        }`}
                    >
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-[#C9A56A]' : 'text-slate-400'}`} />
                      {link.name}
                    </button>
                  )
                })}
              </nav>

              <div className="border-t border-red-950/20 pt-4 bg-[#0b0200]/60 -mx-6 -mb-6 p-6 space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-8 h-8 rounded-full bg-[#C9A56A]/15 border border-[#C9A56A]/30 flex items-center justify-center font-cinzel text-xs font-bold text-[#C9A56A] uppercase shrink-0">
                    {currentUser?.name?.[0]}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white leading-tight">{currentUser?.name}</span>
                    <span className="block text-[8px] font-cinzel text-[#C9A56A] tracking-widest uppercase mt-0.5">ADMIN</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:bg-red-950/20 py-2.5 rounded-lg text-[10px] font-cinzel font-semibold tracking-widest uppercase transition-colors text-slate-400 hover:text-red-400 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT AREA - Main workspace */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8 bg-transparent min-w-0">

          {/* Header Panel with page breadcrumbs and action bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-md border border-slate-200/40 p-5 rounded-xl shadow-sm gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#7A7065] font-cinzel tracking-wider uppercase mb-1">
                <span>Console</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-navy font-bold">{activeTab}</span>
              </div>
              <h2 className="font-cormorant text-3xl font-bold text-[#160400] leading-tight">
                {activeTab === 'overview' && 'System Analytics Overview'}
                {activeTab === 'products' && 'Product Inventory Catalog'}
                {activeTab === 'orders' && 'Client Orders Management'}
                {activeTab === 'customs' && 'Bespoke Custom Orders'}
                {activeTab === 'users' && 'System Accounts Registry'}
              </h2>
            </div>

            {/* Quick Action Button link */}
            <div className="flex items-center gap-3">
              <Link to="/shop">
                <button className="flex items-center justify-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-navy font-cinzel font-semibold text-[9.5px] tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm transition">
                  <ArrowLeft className="w-3.5 h-3.5 text-[#C9A56A]" /> View Showroom
                </button>
              </Link>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">

              {/* Premium Dashboard stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Revenue widget */}
                <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden flex flex-col justify-between h-36 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition duration-200">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-cinzel text-[#7A7065] font-bold tracking-wider">Total Revenue (Paid)</span>
                    <div className="w-8 h-8 rounded-lg bg-[#C9A56A]/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#C9A56A]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold font-jost text-navy">{inrFormatter.format(totalRevenue)}</p>
                    <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last month
                    </span>
                  </div>
                </div>

                {/* Orders widget */}
                <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden flex flex-col justify-between h-36 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition duration-200">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-cinzel text-[#7A7065] font-bold tracking-wider">Total Orders</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-indigo-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold font-jost text-navy">{orders?.length || 0}</p>
                    <span className="text-[10px] text-slate-500">Live order track milestones</span>
                  </div>
                </div>

                {/* Products widget */}
                <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden flex flex-col justify-between h-36 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition duration-200">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-cinzel text-[#7A7065] font-bold tracking-wider">Catalog Products</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold font-jost text-navy">{productsData?.products?.length || 0}</p>
                    <span className="text-[10px] text-slate-500">Stock availability trackers</span>
                  </div>
                </div>

                {/* Users widget */}
                <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden flex flex-col justify-between h-36 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition duration-200">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-cinzel text-[#7A7065] font-bold tracking-wider">Registered Users</span>
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-teal-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold font-jost text-navy">{users?.length || 0}</p>
                    <span className="text-[10px] text-slate-500">Customer base volume</span>
                  </div>
                </div>
              </div>

              {/* Quick stats details panel */}
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <h3 className="font-cinzel text-[10px] uppercase tracking-wider font-bold text-navy mb-5 pb-3 border-b border-slate-100 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#C9A56A]" /> Inventory & Dispatch Snapshot
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-[#7A7065]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-cinzel uppercase font-semibold text-muted">Bespoke Inquiries</p>
                    <p className="font-bold text-navy text-xl">{inquiries?.length || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-cinzel uppercase font-semibold text-muted">Pending Orders</p>
                    <p className="font-bold text-navy text-xl">{orders?.filter(o => o.orderStatus === 'placed').length || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-cinzel uppercase font-semibold text-muted">Shipped Orders</p>
                    <p className="font-bold text-navy text-xl">{orders?.filter(o => o.orderStatus === 'shipped').length || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-cinzel uppercase font-semibold text-muted">Admin Command users</p>
                    <p className="font-bold text-navy text-xl">{users?.filter(u => u.role === 'admin').length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">

              {/* Product control header bar */}
              <div className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <span className="text-xs uppercase font-cinzel font-bold text-navy">{productsData?.products?.length || 0} Registered Items</span>
                <Button
                  variant="primary"
                  className="py-2.5 px-4 text-xs flex items-center gap-1 rounded-lg"
                  onClick={() => { setShowProductForm(!showProductForm); setEditingId(null); }}
                >
                  <Plus className="w-4.5 h-4.5" /> Add Design
                </Button>
              </div>

              {/* Expandable Add/Edit Product form */}
              {showProductForm && (
                <form onSubmit={handleProductSubmit} className="bg-white border border-slate-100 p-6 md:p-8 rounded-xl shadow-lg space-y-6 text-xs text-left">
                  <h3 className="font-cinzel text-[11px] font-bold text-navy uppercase border-b pb-3 mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#C9A56A]" /> {editingId ? 'Edit Product Details' : 'Add New Carpet Design'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-cinzel font-bold text-navy uppercase tracking-wider">Product Name</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-lg focus:outline-none focus:border-[#C9A56A] focus:bg-white transition text-sm"
                        placeholder="e.g. Amber Palace Medallion"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-cinzel font-bold text-navy uppercase tracking-wider">SKU Code</label>
                      <input
                        type="text"
                        required
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-lg focus:outline-none focus:border-[#C9A56A] focus:bg-white transition text-sm"
                        placeholder="e.g. VRC-HB-004"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-cinzel font-bold text-navy uppercase tracking-wider">Weave Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-lg focus:outline-none focus:border-[#C9A56A] focus:bg-white transition text-sm"
                      >
                        <option value="Traditional">Traditional</option>
                        <option value="Silk Masterpieces">Silk Masterpieces</option>
                        <option value="Modern / Abstract">Modern / Abstract</option>
                        <option value="Natural Flatweaves">Natural Flatweaves</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-cinzel font-bold text-navy uppercase tracking-wider">Base Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-lg focus:outline-none focus:border-[#C9A56A] focus:bg-white transition text-sm"
                        placeholder="35000"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[10px] font-cinzel font-bold text-navy uppercase tracking-wider">Available Sizes (comma-separated)</label>
                      <input
                        type="text"
                        value={productForm.sizes}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-lg focus:outline-none focus:border-[#C9A56A] focus:bg-white transition text-sm"
                        placeholder="5x8 ft, 6x9 ft, 8x10 ft"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[10px] font-cinzel font-bold text-navy uppercase tracking-wider">Design Details Description</label>
                      <textarea
                        rows="3"
                        required
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-lg focus:outline-none focus:border-[#C9A56A] focus:bg-white transition text-sm"
                        placeholder="Meticulously hand-knotted by weavers of Mehboobpur..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <Button type="submit" variant="primary" className="py-2.5 px-6 rounded-lg font-bold">Save Carpet Design</Button>
                    <Button variant="outline" className="py-2.5 px-6 rounded-lg font-bold" onClick={() => setShowProductForm(false)}>Cancel</Button>
                  </div>
                </form>
              )}

              {/* Products listing spreadsheet table */}
              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-xs text-left divide-y divide-slate-100">
                    <thead className="bg-[#FAF9F6] text-navy font-cinzel uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-4 pl-6">SKU Code</th>
                        <th className="p-4">Carpet Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Base Price</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-charcoal">
                      {productsData?.products?.map((prod) => (
                        <tr key={prod._id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 pl-6 font-mono font-bold text-[#C9A56A]">{prod.sku}</td>
                          <td className="p-4 font-semibold text-navy">{prod.name}</td>
                          <td className="p-4 text-[#7A7065]">{prod.category}</td>
                          <td className="p-4 font-semibold">{inrFormatter.format(prod.price)}</td>
                          <td className="p-4 pr-6">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setProductForm({
                                    name: prod.name,
                                    sku: prod.sku,
                                    category: prod.category,
                                    price: prod.price.toString(),
                                    description: prod.description,
                                    sizes: prod.sizes.map(s => s.label).join(', ')
                                  })
                                  setEditingId(prod._id)
                                  setShowProductForm(true)
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className="p-2 border border-slate-100 rounded-lg hover:border-[#C9A56A]/40 text-[#C9A56A] hover:bg-[#C9A56A]/5 transition cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id)}
                                className="p-2 border border-slate-100 rounded-lg hover:border-red-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">

              {/* Expandable attach tracking details form */}
              {trackingState.orderId && (
                <form onSubmit={handleTrackingSubmit} className="bg-white border border-slate-100 p-6 md:p-8 rounded-xl shadow-lg space-y-6 text-xs text-left">
                  <h3 className="font-cinzel text-[11px] font-bold text-navy uppercase border-b pb-3 mb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C9A56A]" /> Attach Dispatch Shipment Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-cinzel font-bold text-navy uppercase tracking-wider">Tracking Number</label>
                      <input
                        type="text"
                        required
                        value={trackingState.trackingNumber}
                        onChange={(e) => setTrackingState({ ...trackingState, trackingNumber: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-lg focus:outline-none focus:border-[#C9A56A] focus:bg-white transition text-sm"
                        placeholder="e.g. VRC-SH-82736"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-cinzel font-bold text-navy uppercase tracking-wider">Tracking URL</label>
                      <input
                        type="text"
                        value={trackingState.trackingUrl}
                        onChange={(e) => setTrackingState({ ...trackingState, trackingUrl: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200/80 p-3 rounded-lg focus:outline-none focus:border-[#C9A56A] focus:bg-white transition text-sm"
                        placeholder="e.g. https://shipment-track.com/VRC-SH-82736"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <Button type="submit" variant="primary" className="py-2.5 px-6 rounded-lg font-bold">Attach & Ship</Button>
                    <Button variant="outline" className="py-2.5 px-6 rounded-lg font-bold" onClick={() => setTrackingState({ orderId: '', trackingNumber: '', trackingUrl: '' })}>Cancel</Button>
                  </div>
                </form>
              )}

              {/* Orders table panel */}
              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-xs text-left divide-y divide-slate-100">
                    <thead className="bg-[#FAF9F6] text-navy font-cinzel uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-4 pl-6">Order No</th>
                        <th className="p-4">Client Recipient</th>
                        <th className="p-4">Total Price</th>
                        <th className="p-4">Order Milestone Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-charcoal">
                      {orders?.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 pl-6 font-mono font-bold text-navy">{order.orderNumber}</td>
                          <td className="p-4 font-semibold">{order.shippingAddress.name}</td>
                          <td className="p-4 font-bold text-slate-900">{inrFormatter.format(order.total)}</td>
                          <td className="p-4">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="bg-slate-50 border border-slate-200/80 p-2 rounded-lg focus:outline-none text-[11px] focus:bg-white cursor-pointer font-medium text-navy"
                            >
                              <option value="placed">placed</option>
                              <option value="confirmed">confirmed</option>
                              <option value="processing">processing</option>
                              <option value="shipped">shipped</option>
                              <option value="delivered">delivered</option>
                              <option value="cancelled">cancelled</option>
                              <option value="return_requested">return_requested</option>
                              <option value="exchange_requested">exchange_requested</option>
                              <option value="returned">returned</option>
                              <option value="exchanged">exchanged</option>
                            </select>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              onClick={() => setTrackingState({ orderId: order._id, trackingNumber: order.trackingNumber || '', trackingUrl: order.trackingUrl || '' })}
                              className="inline-flex items-center gap-1.5 border border-[#C9A56A]/20 hover:border-[#C9A56A] text-[#C9A56A] hover:bg-[#C9A56A]/5 px-3.5 py-2 rounded-lg font-cinzel text-[9px] tracking-wider uppercase font-bold transition cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" /> Ship Track
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM INQUIRIES */}
          {activeTab === 'customs' && (
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)] animate-fadeIn">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs text-left divide-y divide-slate-100">
                  <thead className="bg-[#FAF9F6] text-navy font-cinzel uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-4 pl-6">Client / Contact</th>
                      <th className="p-4">Dimensions</th>
                      <th className="p-4">Pattern Style</th>
                      <th className="p-4">Est. Budget</th>
                      <th className="p-4 pr-6">Status Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-charcoal">
                    {inquiries?.map((inq) => (
                      <tr key={inq._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 pl-6">
                          <span className="font-semibold block text-navy">{inq.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{inq.phone}</span>
                        </td>
                        <td className="p-4 text-[#7A7065]">{inq.shape} ({inq.size})</td>
                        <td className="p-4 font-medium text-slate-800">{inq.pattern}</td>
                        <td className="p-4 font-bold text-[#C9A56A]">{inq.budget}</td>
                        <td className="p-4 pr-6">
                          <select
                            value={inq.status}
                            onChange={(e) => handleInquiryStatus(inq._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200/80 p-2 rounded-lg focus:outline-none text-[11px] focus:bg-white cursor-pointer font-medium text-navy"
                          >
                            <option value="new">new</option>
                            <option value="contacted">contacted</option>
                            <option value="quoted">quoted</option>
                            <option value="confirmed">confirmed</option>
                            <option value="rejected">rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="bg-white border border-slate-100 px-6 py-4 rounded-xl flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <span className="font-cinzel text-[10px] uppercase tracking-wider font-bold text-navy flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C9A56A]" />
                  Registered System Accounts — {users?.length || 0} total
                </span>
              </div>

              {usersLoading && (
                <div className="bg-white border border-slate-100 rounded-xl p-12 text-center shadow-sm">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C9A56A] mx-auto mb-3"></div>
                  <p className="text-xs text-muted font-cinzel">Loading account registries...</p>
                </div>
              )}

              {usersError && (
                <div className="bg-white border border-slate-100 rounded-xl p-12 text-center shadow-sm">
                  <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-3" />
                  <p className="font-cormorant text-xl text-navy">Failed to load registry</p>
                  <p className="text-xs text-muted mt-1">API fetch encountered an error. Verify network credentials.</p>
                </div>
              )}

              {!usersLoading && !usersError && users && (
                <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-xs text-left divide-y divide-slate-100">
                      <thead className="bg-[#FAF9F6] text-navy font-cinzel uppercase font-bold tracking-wider">
                        <tr>
                          <th className="p-4 pl-6">#</th>
                          <th className="p-4">Account Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Permissions Role</th>
                          <th className="p-4">Joined</th>
                          <th className="p-4 text-center">Addresses</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-charcoal">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-muted">
                              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                              No users registered in system yet.
                            </td>
                          </tr>
                        ) : users.map((u, i) => {
                          const isSelf = u._id === currentUser._id;
                          return (
                            <tr key={u._id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4 pl-6 text-slate-400 font-mono">{i + 1}</td>
                              <td className="p-4 font-bold text-navy">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-[#160400]/5 border border-navy/10 flex items-center justify-center font-cinzel text-[10px] font-bold text-navy shrink-0">
                                    {u.name?.[0]?.toUpperCase()}
                                  </div>
                                  <span>{u.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-slate-500">{u.email}</td>
                              <td className="p-4 text-slate-500">{u.phone || '—'}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 uppercase tracking-widest font-cinzel text-[8px] font-bold rounded-sm ${u.role === 'admin'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-slate-50 text-[#7A7065] border border-slate-200'
                                  }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                              </td>
                              <td className="p-4 text-center font-semibold text-navy">
                                {u.addresses?.length || 0}
                              </td>
                              <td className="p-4 pr-6 text-right">
                                <button
                                  disabled={isSelf}
                                  onClick={() => handleDeleteUser(u._id, u.name)}
                                  className={`p-2 border border-slate-100 rounded-lg transition ${isSelf
                                    ? 'opacity-30 cursor-not-allowed text-slate-300'
                                    : 'hover:border-red-200 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                                    }`}
                                  title={isSelf ? "You cannot delete your own account" : "Delete User Account"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  )
}
