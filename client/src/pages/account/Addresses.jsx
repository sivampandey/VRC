// src/pages/account/Addresses.jsx
// Full CRUD for user addresses via RTK Query

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { MapPin, Plus, Pencil, Trash2, ChevronRight, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from '../../store/api/authApi'
import { updateStoredUser } from '../../store/authSlice'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
]

const inputClass =
  'border-0 border-b border-cream-dark bg-transparent w-full px-0 py-2.5 font-jost text-[13.5px] text-navy font-light placeholder:text-cream-dark outline-none focus:border-navy transition-colors'

// ─── Address Card ─────────────────────────────────────────────
function AddressCard({ address, onEdit, onDelete }) {
  return (
    <div className={`
      bg-white border p-5 lg:p-6 relative transition-all
      ${address.isDefault ? 'border-gold' : 'border-cream-dark hover:border-gold/40'}
    `}>
      {address.isDefault && (
        <div className="absolute top-3 right-3 bg-gold text-navy font-cinzel text-[7.5px] tracking-[0.12em] px-2.5 py-1 flex items-center gap-1">
          <Star size={8} fill="currentColor" /> DEFAULT
        </div>
      )}

      <p className="font-cinzel text-[9.5px] tracking-[0.14em] text-navy mb-3 flex items-center gap-2">
        <MapPin size={13} className="text-gold" />
        {address.label?.toUpperCase() || 'ADDRESS'}
      </p>

      <address className="not-italic font-jost text-[13px] text-charcoal font-light leading-[1.85]">
        {address.name && (
          <>
            <span className="font-medium">{address.name}</span><br />
          </>
        )}
        {address.line1}<br />
        {address.line2 && <>{address.line2}<br /></>}
        {address.city}, {address.state} – {address.pincode}<br />
        {address.phone && <span className="text-muted">{address.phone}</span>}
      </address>

      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-warmcream">
        <button
          onClick={() => onEdit(address)}
          className="font-cinzel text-[8.5px] tracking-[0.1em] text-muted border border-cream-dark px-3 py-2 hover:border-navy hover:text-navy transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Pencil size={10} /> EDIT
        </button>
        <button
          onClick={() => onDelete(address._id)}
          className="font-cinzel text-[8.5px] tracking-[0.1em] text-burgundy border border-burgundy/30 px-3 py-2 hover:bg-burgundy hover:text-cream transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 size={10} /> REMOVE
        </button>
      </div>
    </div>
  )
}

// ─── Address Form ─────────────────────────────────────────────
function AddressForm({ defaultValues, onSave, onCancel, isSaving }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || { label: 'Home' },
  })

  return (
    <div className="bg-white border border-gold p-6 lg:p-7">
      <h3 className="font-cinzel text-[11px] tracking-[0.18em] text-navy mb-6 pb-4 border-b border-cream-dark">
        {defaultValues?._id ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}
      </h3>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-5">

          {/* Label radios */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">ADDRESS LABEL</label>
            <div className="flex gap-5 flex-wrap">
              {['Home', 'Office', 'Other'].map(l => (
                <label key={l} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register('label')} value={l} className="accent-[#C9A56A]" />
                  <span className="font-cinzel text-[9px] tracking-wider text-muted">{l.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">FULL NAME *</label>
            <input {...register('name', { required: 'Required' })} className={inputClass} placeholder="Recipient name" />
            {errors.name && <p className="text-burgundy text-[11px]">{errors.name.message}</p>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">PHONE NUMBER *</label>
            <input
              {...register('phone', {
                required: 'Required',
                pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid number' },
              })}
              type="tel"
              className={inputClass}
              placeholder="10-digit mobile number"
            />
            {errors.phone && <p className="text-burgundy text-[11px]">{errors.phone.message}</p>}
          </div>

          {/* Line 1 */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">ADDRESS LINE 1 *</label>
            <input {...register('line1', { required: 'Required' })} className={inputClass} placeholder="House / flat / building number, street" />
            {errors.line1 && <p className="text-burgundy text-[11px]">{errors.line1.message}</p>}
          </div>

          {/* Line 2 */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">ADDRESS LINE 2</label>
            <input {...register('line2')} className={inputClass} placeholder="Area, locality, landmark (optional)" />
          </div>

          {/* City */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">CITY *</label>
            <input {...register('city', { required: 'Required' })} className={inputClass} placeholder="City" />
            {errors.city && <p className="text-burgundy text-[11px]">{errors.city.message}</p>}
          </div>

          {/* State */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">STATE *</label>
            <select {...register('state', { required: 'Required' })} className={`${inputClass} cursor-pointer`}>
              <option value="">Select state</option>
              {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-burgundy text-[11px]">{errors.state.message}</p>}
          </div>

          {/* Pincode */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">PINCODE *</label>
            <input
              {...register('pincode', {
                required: 'Required',
                pattern: { value: /^\d{6}$/, message: '6-digit pincode' },
              })}
              className={inputClass}
              placeholder="6-digit pincode"
              maxLength={6}
            />
            {errors.pincode && <p className="text-burgundy text-[11px]">{errors.pincode.message}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-7 pt-5 border-t border-cream-dark">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-navy text-cream font-cinzel text-[10px] tracking-[0.14em] px-7 py-3.5 hover:bg-navy-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? 'SAVING...' : 'SAVE ADDRESS'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-cream-dark text-muted font-cinzel text-[10px] tracking-[0.12em] px-6 py-3.5 hover:border-navy hover:text-navy transition-colors cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export default function Addresses() {
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState(null)
  const dispatch = useDispatch()

  const { data: addresses = [], isLoading }  = useGetAddressesQuery()
  const [addAddress,    { isLoading: isAdding    }] = useAddAddressMutation()
  const [updateAddress, { isLoading: isUpdating  }] = useUpdateAddressMutation()
  const [deleteAddress]                              = useDeleteAddressMutation()

  async function handleSave(data) {
    try {
      if (editing?._id) {
        const updatedAddresses = await updateAddress({ id: editing._id, ...data }).unwrap()
        dispatch(updateStoredUser({ addresses: updatedAddresses }))
        toast.success('Address updated')
      } else {
        const updatedAddresses = await addAddress(data).unwrap()
        dispatch(updateStoredUser({ addresses: updatedAddresses }))
        toast.success('Address added')
      }
      setShowForm(false)
      setEditing(null)
    } catch {
      toast.error('Failed to save address')
    }
  }

  async function handleDelete(id) {
    try {
      const updatedAddresses = await deleteAddress(id).unwrap()
      dispatch(updateStoredUser({ addresses: updatedAddresses }))
      toast.success('Address removed')
    } catch {
      toast.error('Failed to remove address')
    }
  }

  return (
    <div className="px-5 sm:px-8 lg:px-10 xl:px-12 py-8 lg:py-10">

      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 font-cinzel text-[9.5px] tracking-[0.1em] text-muted mb-3">
            <span>HOME</span>
            <ChevronRight size={10} />
            <span>ACCOUNT</span>
            <ChevronRight size={10} />
            <span className="text-gold">ADDRESSES</span>
          </div>
          <h1 className="font-cormorant text-[2.2rem] lg:text-[2.6rem] text-navy font-semibold">
            My Addresses
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
            <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-gold to-transparent" />
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditing(null) }}
            className="bg-navy text-cream font-cinzel text-[10px] tracking-[0.12em] px-6 py-3 flex items-center gap-2 hover:bg-navy-light transition-colors cursor-pointer"
          >
            <Plus size={13} /> ADD ADDRESS
          </button>
        )}
      </div>

      {/* Address form */}
      {showForm && (
        <div className="mb-6">
          <AddressForm
            defaultValues={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null) }}
            isSaving={isAdding || isUpdating}
          />
        </div>
      )}

      {/* Addresses grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white border border-cream-dark p-6 animate-pulse space-y-3">
              <div className="h-3 bg-cream-dark rounded w-1/4" />
              <div className="h-3 bg-cream-dark rounded w-3/4" />
              <div className="h-3 bg-cream-dark rounded w-1/2" />
              <div className="h-3 bg-cream-dark rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <AddressCard
              key={addr._id}
              address={addr}
              onEdit={a => { setEditing(a); setShowForm(true) }}
              onDelete={handleDelete}
            />
          ))}

          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditing(null) }}
              className="bg-white border border-dashed border-cream-dark flex flex-col items-center justify-center gap-3 min-h-[180px] hover:border-gold transition-colors cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full border border-cream-dark flex items-center justify-center">
                <Plus size={20} className="text-muted" />
              </div>
              <span className="font-cinzel text-[9.5px] tracking-[0.14em] text-muted">ADD NEW ADDRESS</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
