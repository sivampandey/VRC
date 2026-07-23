import React from 'react'
import { NavLink } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react'
import logoImg from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-[#100301] border-t border-[#C9A56A]/15 text-left font-jost text-[#FAF5F0]/80 py-6 sm:py-10 px-4 md:px-12 relative z-10">
      <div className="container max-w-[1200px] mx-auto">
        {/* Main grid: 2-cols on mobile, 5-cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-6 pb-4 sm:pb-8">

          {/* Logo & Contact Info (2 columns wide) */}
          <div className="col-span-2 lg:col-span-2 space-y-2.5 sm:space-y-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-white border border-[#C9A56A]/30 flex items-center justify-center">
                  <img src={logoImg} alt="VRC Monogram" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
                </div>
                <div>
                  <div className="font-cinzel text-sm sm:text-base tracking-[0.2em] text-[#C9A56A] font-bold leading-none">VAISHNAV</div>
                  <div className="font-cinzel text-[5.5px] sm:text-[6px] tracking-[0.32em] text-[#E4CEA8] opacity-80 mt-0.5 sm:mt-1 leading-none">RUG COLLECTION</div>
                </div>
              </div>
              <p className="font-cormorant text-xs sm:text-sm italic text-[#FAF5F0]/75 mt-2 sm:mt-3 leading-relaxed">
                Woven with tradition, made for generations.
              </p>
            </div>

            {/* Address, Phone, Email list with Lucide Icons */}
            <div className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-[#FAF5F0]/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A56A] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-tight sm:leading-relaxed">
                  Mehboobpur, Bhadohi, UP 221401, India<br />
                  <span className="opacity-60 text-[9px]">Near Indra Mill Chauraha · St. Xavier School</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A56A] shrink-0" aria-hidden="true" />
                <p className="font-medium text-[11px] sm:text-xs">+91 87076 30603 &nbsp;·&nbsp; +91 91295 15971</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A56A] shrink-0" aria-hidden="true" />
                <a href="mailto:hello@vaishnavrug.com" className="hover:text-[#C9A56A] transition text-[11px] sm:text-xs">hello@vaishnavrug.com</a>
              </div>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-cinzel text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] text-[#C9A56A] font-bold">Shop</h4>
            <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs">
              <li><NavLink to="/shop" className="hover:text-[#C9A56A] transition">All Rugs</NavLink></li>
              <li><NavLink to="/shop?filter=new" className="hover:text-[#C9A56A] transition">New Arrivals</NavLink></li>
              <li><NavLink to="/shop?filter=bestsellers" className="hover:text-[#C9A56A] transition">Best Sellers</NavLink></li>
              <li><NavLink to="/shop?category=traditional" className="hover:text-[#C9A56A] transition">Traditional</NavLink></li>
              <li><NavLink to="/shop?category=modern" className="hover:text-[#C9A56A] transition">Modern</NavLink></li>
              <li><NavLink to="/shop?material=silk" className="hover:text-[#C9A56A] transition">Silk</NavLink></li>
              <li><NavLink to="/custom-order" className="hover:text-[#C9A56A] transition font-semibold text-[#E4CEA8]">Custom Rugs</NavLink></li>
            </ul>
          </div>

          {/* HELP Column */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-cinzel text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] text-[#C9A56A] font-bold">Help</h4>
            <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs">
              <li><NavLink to="/help/shipping" className="hover:text-[#C9A56A] transition">Shipping Policy</NavLink></li>
              <li><NavLink to="/help/returns" className="hover:text-[#C9A56A] transition">Returns &amp; Exchanges</NavLink></li>
              <li><NavLink to="/help/care" className="hover:text-[#C9A56A] transition">Rug Care Guide</NavLink></li>
              <li><NavLink to="/help/faq" className="hover:text-[#C9A56A] transition">FAQ</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-[#C9A56A] transition">Contact Us</NavLink></li>
            </ul>
          </div>

          {/* COMPANY & Socials Column */}
          <div className="col-span-2 sm:col-span-1 space-y-2.5 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-cinzel text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] text-[#C9A56A] font-bold">Company</h4>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs">
                <li><NavLink to="/about" className="hover:text-[#C9A56A] transition">About Us</NavLink></li>
                <li><NavLink to="/about#heritage" className="hover:text-[#C9A56A] transition">Our Heritage</NavLink></li>
                <li><NavLink to="/journal" className="hover:text-[#C9A56A] transition">Journal</NavLink></li>
              </ul>
            </div>

            {/* Social square icon frames */}
            <div className="flex gap-2 pt-0.5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 border border-[#FAF5F0]/20 flex items-center justify-center hover:border-[#C9A56A] hover:text-[#C9A56A] transition duration-300">
                <Instagram className="w-3.5 h-3.5 text-[#C9A56A]" aria-label="Instagram" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 border border-[#FAF5F0]/20 flex items-center justify-center hover:border-[#C9A56A] hover:text-[#C9A56A] transition duration-300">
                <Facebook className="w-3.5 h-3.5 text-[#C9A56A]" aria-label="Facebook" />
              </a>
              <a href="https://wa.me/918707630603" target="_blank" rel="noopener noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 border border-[#FAF5F0]/20 flex items-center justify-center hover:border-[#C9A56A] hover:text-[#C9A56A] transition duration-300">
                <MessageCircle className="w-3.5 h-3.5 text-[#C9A56A]" aria-label="WhatsApp" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#C9A56A]/15 pt-3 sm:pt-4 flex flex-col sm:flex-row justify-between items-center text-[9px] sm:text-[10px] text-[#FAF5F0]/55 gap-2 sm:gap-3">
          <div className="tracking-wide text-center sm:text-left">
            © 2026 Vaishnav Rug Collection &nbsp;·&nbsp; Proprietor: Rashmi Jaiswal &nbsp;·&nbsp; All rights reserved.
          </div>
          <div className="flex gap-4">
            <NavLink to="/privacy-policy" className="hover:text-[#C9A56A] transition">Privacy Policy</NavLink>
            <NavLink to="/terms-conditions" className="hover:text-[#C9A56A] transition">Terms of Service</NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
