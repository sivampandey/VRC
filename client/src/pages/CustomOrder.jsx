import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Check, ArrowRight, ArrowLeft, MessageSquare } from 'lucide-react'
import { useSubmitCustomInquiryMutation } from '../store/api/ordersApi'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/ui/ScrollReveal'
import customOrderBg from '../assets/custom_order_bg.jpg'

export default function CustomOrder() {
  const [step, setStep] = useState(1)
  const [shape, setShape] = useState('Rectangle')
  const [dimensions, setDimensions] = useState({ length: '', width: '' })
  const [material, setMaterial] = useState('Wool')
  const [weaveType, setWeaveType] = useState('Hand-Knotted')
  const [pattern, setPattern] = useState('Floral')
  const [selectedColors, setSelectedColors] = useState([])
  const [budget, setBudget] = useState('₹10,000–25,000')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState({ name: '', email: '', phone: '', channel: 'WhatsApp' })
  const [success, setSuccess] = useState(false)

  const [submitInquiry, { isLoading }] = useSubmitCustomInquiryMutation()

  const handleColorToggle = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4))
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Build payload structure
    const payload = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      size: `${dimensions.length || '5'}x${dimensions.width || '8'} ft`,
      shape,
      material,
      color: selectedColors.join(', ') || 'Discuss Color Swatches',
      pattern,
      budget,
      description
    }

    try {
      await submitInquiry(payload).unwrap()
      setSuccess(true)
      toast.success('Bespoke custom order request submitted!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit custom inquiry. Attempting WhatsApp fallback...')

      // WhatsApp fallback link trigger
      const waText = `Hi VRC, I would like to commission a custom carpet:\n- Shape: ${shape}\n- Size: ${payload.size}\n- Material: ${material}\n- Design: ${pattern}\n- Budget: ${budget}\n- Name: ${contact.name}`
      window.open(`https://wa.me/918707630603?text=${encodeURIComponent(waText)}`, '_blank')
    }
  }

  // Pre-fill fields
  const swatches = ['Navy Blue', 'Saffron Gold', 'Rich Burgundy', 'Cream Ivory', 'Charcoal Grey', 'Soft Pink', 'Terracotta Red', 'Emerald Green']

  return (
    <>
      <Helmet>
        <title>Bespoke Carpets Commission | Vaishnav Rug Collection</title>
        <meta name="description" content="Design and order a custom carpet with VRC. Select custom dimensions, organic materials, and classic weave patterns." />
      </Helmet>

      {/* Main container — fallback bg prevents flash */}
      <div className="relative py-24 min-h-screen text-left font-jost bg-[#1a0f08]">

        {/* Blurred background — position:fixed avoids bg-fixed+filter browser bug */}
        <div
          className="pointer-events-none"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${customOrderBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6px)',
            transform: 'scale(1.08)',
            zIndex: 0
          }}
        />
        {/* Dark overlay wash for text contrast */}
        <div className="pointer-events-none" style={{ position: 'fixed', inset: 0, background: 'rgba(26,15,8,0.50)', zIndex: 1 }} />

        <div className="relative container max-w-[650px] mx-auto px-4" style={{ zIndex: 2 }}>

          <ScrollReveal direction="up" className="text-center mb-10">
            <span className="inline-block font-cinzel text-[10px] tracking-[0.25em] text-[#C9A56A] uppercase font-semibold mb-2">Tailored Exclusives</span>
            <h1 className="font-cormorant text-3xl md:text-4xl text-white font-bold leading-tight">Bespoke Rug Commission</h1>
            <p className="text-xs text-white/80 mt-2 font-jost">Get a personalized craft assessment in 24 hours.</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12 bg-[#C9A56A]/40"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A56A]"></div>
              <div className="h-px w-12 bg-[#C9A56A]/40"></div>
            </div>
          </ScrollReveal>

          {success ? (
            <ScrollReveal direction="up" className="bg-[#160400]/90 backdrop-blur-xl border border-white/10 p-8 text-center space-y-6 text-white shadow-2xl rounded-sm">
              <span className="text-5xl block">🎉</span>
              <h2 className="font-cormorant text-2xl text-[#C9A56A] font-bold">Commission Request Received!</h2>
              <p className="text-sm text-white/80 max-w-sm mx-auto leading-relaxed">
                Thank you for selecting VRC, <strong>{contact.name}</strong>. Our Bhadohi design loom will email or contact you within 24 hours.
              </p>

              <div className="pt-4 space-y-2.5">
                <p className="text-xs text-white/50">You can also connect directly with proprietress Rashmi Jaiswal on WhatsApp:</p>
                <a
                  href={`https://wa.me/918707630603?text=${encodeURIComponent(`Hi VRC, I just submitted a custom commission request under the name ${contact.name}. Please review.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 font-cinzel text-xs tracking-widest font-semibold transition rounded-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-white" /> Connect on WhatsApp
                </a>
              </div>
            </ScrollReveal>
          ) : (
            /* Frosted Dark Glass Form Container - High Contrast */
            <div className="bg-[#2a3342]/20 backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-8 text-white shadow-2xl rounded-sm">

              {/* Stepper Header Badges */}
              <div className="flex justify-betwen items-center border-b border-white/10 pb-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step >= num ? 'bg-[#C9A56A] text-[#160400]' : 'bg-white/5 text-white/60 border border-white/10'
                      }`}>
                      {step > num ? <Check className="w-3.5 h-3.5" /> : num}
                    </span>
                    <span className={`text-[10px] uppercase font-cinzel tracking-wider hidden sm:inline ${step === num ? 'text-[#C9A56A] font-bold font-semibold' : 'text-white/50'
                      }`}>
                      {num === 1 ? 'Size' : num === 2 ? 'Weave' : num === 3 ? 'Budget' : 'Contact'}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* STEP 1: SIZE & SHAPE */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">Step 1 — Shape & Sizing</h3>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-white/80 uppercase">Select Shape</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                        {['Rectangle', 'Square', 'Round', 'Runner', 'Oval'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setShape(s)}
                            className={`py-2 border text-xs transition cursor-pointer rounded-sm ${shape === s
                              ? 'border-[#C9A56A] bg-[#C9A56A] text-[#160400] font-bold shadow-md'
                              : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/20'
                              }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-white/80 uppercase">Rug Sizing Dimensions (ft)</label>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          placeholder="Width (e.g. 5)"
                          value={dimensions.width}
                          onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
                          required
                          className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/50 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                        />
                        <span className="flex items-center text-white/40">✖</span>
                        <input
                          type="number"
                          placeholder="Length (e.g. 8)"
                          value={dimensions.length}
                          onChange={(e) => setDimensions(prev => ({ ...prev, length: e.target.value }))}
                          required
                          className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/50 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: WEAVE & PREFERENCES */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">Step 2 — Design Preferences</h3>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-white/80 uppercase">Fiber Type</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {['Wool', 'Mulberry Silk', 'Jute', 'Cotton', 'Mixed blend'].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMaterial(m)}
                            className={`py-2 border text-xs transition cursor-pointer rounded-sm ${material === m
                              ? 'border-[#C9A56A] bg-[#C9A56A] text-[#160400] font-bold shadow-md'
                              : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/20'
                              }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-white/80 uppercase">Weave Pile Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Hand-Knotted', 'Hand-Tufted', 'Flatweave Dhurrie'].map(w => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setWeaveType(w)}
                            className={`py-2 border text-xs transition cursor-pointer rounded-sm ${weaveType === w
                              ? 'border-[#C9A56A] bg-[#C9A56A] text-[#160400] font-bold shadow-md'
                              : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/20'
                              }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-white/80 uppercase">Preferred Color Palette (Swatches)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {swatches.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleColorToggle(c)}
                            className={`py-2 border text-xs transition cursor-pointer rounded-sm ${selectedColors.includes(c)
                              ? 'border-[#C9A56A] bg-[#C9A56A] text-[#160400] font-bold shadow-md'
                              : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/20'
                              }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: DETAILS & BUDGET */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">Step 3 — Details & Sourcing Budget</h3>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-white/80 uppercase">Budget Category</label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="₹5,000–10,000" className="bg-[#160400] text-white">₹5,000–10,000</option>
                        <option value="₹10,000–25,000" className="bg-[#160400] text-white">₹10,000–25,000</option>
                        <option value="₹25,000–50,000" className="bg-[#160400] text-white">₹25,000–50,000</option>
                        <option value="₹50,000+" className="bg-[#160400] text-white">₹50,000+ (High knot-count luxury)</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-white/80 uppercase">Custom Request Notes</label>
                      <textarea
                        rows="5"
                        placeholder="Detail the floral or abstract design requests, specific pile height, background motifs..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/50 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONTACT & SUBMIT */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">Step 4 — Customer Details</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-white/80 uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={contact.name}
                          onChange={(e) => setContact(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/50 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/80 uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contact.email}
                          onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/50 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/80 uppercase mb-1">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={contact.phone}
                          onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/50 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action buttons footer */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="font-cinzel text-xs tracking-widest font-semibold text-white/80 uppercase flex items-center gap-1.5 cursor-pointer hover:text-[#C9A56A] transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-white/10 border border-white/15 text-white font-cinzel text-[10px] tracking-widest font-semibold px-6 py-3 uppercase flex items-center gap-1.5 cursor-pointer hover:bg-[#C9A56A] hover:text-[#160400] transition rounded-sm"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      className="py-3 px-8 uppercase font-bold text-xs tracking-wider"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Commission'}
                    </Button>
                  )}
                </div>

              </form>

            </div>
          )}

        </div>
      </div>
    </>
  )
}
