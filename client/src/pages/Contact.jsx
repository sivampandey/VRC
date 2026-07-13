import React from 'react'
import { Helmet } from 'react-helmet-async'
import { MessageSquare, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/ui/ScrollReveal'
import contactBgImg from '../assets/contact_bg.jpg'

export default function Contact() {
  const handleSendMessage = (e) => {
    e.preventDefault()
    toast.success('Your message has been sent. We will get back to you shortly!')
    e.target.reset()
  }

  return (
    <>
      <Helmet>
        <title>Contact Our Showroom | Vaishnav Rug Collection</title>
        <meta name="description" content="Reach our showroom in Bhadohi, Uttar Pradesh. Contact Rashmi Jaiswal directly." />
      </Helmet>

      {/* Main container — fallback bg prevents flash */}
      <div className="relative py-24 min-h-screen text-left font-jost bg-[#120c08]">

        {/* Blurred background — position:fixed avoids bg-fixed+filter browser bug */}
        <div
          className="pointer-events-none"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${contactBgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6px)',
            transform: 'scale(1.08)',
            zIndex: 0
          }}
        />
        {/* Dark overlay wash for text and card contrast */}
        <div className="pointer-events-none" style={{ position: 'fixed', inset: 0, background: 'rgba(18,12,8,0.52)', zIndex: 1 }} />

        <div className="relative container max-w-[900px] mx-auto px-4" style={{ zIndex: 2 }}>
          
          <ScrollReveal direction="up" className="text-center mb-12">
            <span className="inline-block font-cinzel text-[10px] tracking-[0.25em] text-[#C9A56A] uppercase font-semibold mb-2">Locate VRC</span>
            <h1 className="font-cormorant text-3xl md:text-4xl text-white font-bold leading-tight">Contact Us</h1>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12 bg-[#C9A56A]/40"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A56A]"></div>
              <div className="h-px w-12 bg-[#C9A56A]/40"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Showroom Details (Frosted Glass) */}
            <ScrollReveal direction="up" className="space-y-6 bg-white/12 backdrop-blur-xl border border-white/15 p-6 md:p-8 shadow-2xl rounded-sm text-white">
              <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                Bhadohi Head Showroom
              </h3>

              <div className="space-y-4 text-xs text-white/80">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#C9A56A] shrink-0" />
                  <div>
                    <span className="font-bold block text-white mb-0.5">Showroom Address</span>
                    <p>Mehboobpur, Bhadohi,<br />Uttar Pradesh – 221401</p>
                    <p className="text-[10px] text-white/50 mt-1">Near Indra Mill Chauraha<br />Landmark: St. Xavier School</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-[#C9A56A] shrink-0" />
                  <div>
                    <span className="font-bold block text-white mb-0.5">Helplines</span>
                    <p>+91 8707630603</p>
                    <p>+91 9129515971</p>
                    <p className="text-[10px] text-white/50">Proprietor: Rashmi Jaiswal</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <a 
                  href="https://wa.me/918707630603" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-cinzel text-xs font-semibold tracking-widest py-3.5 uppercase transition shadow-md rounded-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-white" /> Chat on WhatsApp
                </a>
              </div>
            </ScrollReveal>

            {/* Message form (Frosted Glass) */}
            <ScrollReveal direction="up" delay={0.1}>
              <form onSubmit={handleSendMessage} className="bg-white/12 backdrop-blur-xl border border-white/15 p-6 md:p-8 space-y-4 text-white shadow-2xl rounded-sm">
                <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                  Send a Message
                </h3>

                <div>
                  <label className="block text-[10px] uppercase font-cinzel font-bold text-white/80 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/15 p-3 text-xs text-white placeholder-white/40 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-cinzel font-bold text-white/80 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/15 p-3 text-xs text-white placeholder-white/40 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-cinzel font-bold text-white/80 mb-1">Message</label>
                  <textarea
                    rows="4"
                    required
                    className="w-full bg-white/5 border border-white/15 p-3 text-xs text-white placeholder-white/40 focus:bg-white/10 focus:border-[#C9A56A] focus:outline-none rounded-sm"
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" className="w-full py-3.5 uppercase font-bold text-xs tracking-wider">
                  Send Message
                </Button>
              </form>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </>
  )
}
