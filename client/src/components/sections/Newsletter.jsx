import React from 'react'
import toast from 'react-hot-toast'
import ScrollReveal from '../ui/ScrollReveal'

export default function Newsletter() {
  const handleSubscribe = (e) => {
    e.preventDefault()
    const email = new FormData(e.target).get('newsletter-email')
    toast.success(`Thank you! ${email} has been subscribed to VRC.`)
    e.target.reset()
  }

  return (
    <section className="bg-[#160400] py-20 px-6 text-center text-[#FAF5F0] border-t border-[#C9A56A]/10 relative z-10" role="region" aria-label="Newsletter signup">
      <div className="container max-w-[660px] mx-auto space-y-6">
        <ScrollReveal direction="up" className="space-y-3">
          <span className="block text-[9.5px] uppercase font-cinzel tracking-[0.25em] text-[#C9A56A] font-bold">
            STAY INSPIRED
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#FAF5F0] font-normal leading-tight max-w-[540px] mx-auto">
            New Collections, Weaving Stories & Private Offers.
          </h2>
          <p className="text-xs text-[#FAF5F0]/65 font-jost leading-relaxed max-w-[420px] mx-auto">
            Delivered thoughtfully to your inbox. No spam. Unsubscribe anytime.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto pt-4">
            <input
              className="flex-1 bg-transparent border border-[#C9A56A]/30 px-4 py-3 text-xs text-[#FAF5F0] placeholder-[#FAF5F0]/30 focus:border-[#C9A56A] focus:outline-none transition font-jost rounded-none"
              type="email"
              name="newsletter-email"
              placeholder="Your email address"
              aria-label="Email address"
              required
            />
            <button 
              type="submit" 
              className="bg-[#C9A56A] hover:bg-[#E4CEA8] text-[#160400] font-cinzel font-bold text-[10px] tracking-widest px-8 py-3 transition duration-300 rounded-none shrink-0"
            >
              SUBSCRIBE
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  )
}
