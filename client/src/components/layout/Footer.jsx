import React from 'react'
import { NavLink } from 'react-router-dom'
import logoImg from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-[#100301] border-t border-[#C9A56A]/15 text-left font-jost text-[#FAF5F0]/80 py-10 px-4 md:px-12 relative z-10">
      <div className="container max-w-[1200px] mx-auto">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8">

          {/* Logo & Contact Info (2 columns wide) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white border border-[#C9A56A]/30 flex items-center justify-center">
                  <img src={logoImg} alt="VRC Monogram" className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <div className="font-cinzel text-base tracking-[0.2em] text-[#C9A56A] font-bold leading-none">VAISHNAV</div>
                  <div className="font-cinzel text-[6px] tracking-[0.32em] text-[#E4CEA8] opacity-80 mt-1 leading-none">RUG COLLECTION</div>
                </div>
              </div>
              <p className="font-cormorant text-sm italic text-[#FAF5F0]/75 mt-3 leading-relaxed">
                Woven with tradition,<br />made for generations.
              </p>
            </div>

            {/* Address, Phone, Email list with Tabler Icons */}
            <div className="space-y-2.5 text-xs text-[#FAF5F0]/70">
              <div className="flex items-start gap-2.5">
                <i className="ti ti-map-pin text-[#C9A56A] text-xs shrink-0 mt-0.5" aria-hidden="true"></i>
                <p className="leading-relaxed">
                  Mehboobpur, Bhadohi<br />
                  Uttar Pradesh 221401, India<br />
                  <span className="opacity-60 text-[10px]">Near Indra Mill Chauraha · Landmark: St. Xavier School</span>
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="ti ti-phone text-[#C9A56A] text-xs shrink-0" aria-hidden="true"></i>
                <p className="font-medium text-xs">+91 87076 30603 &nbsp;·&nbsp; +91 91295 15971</p>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="ti ti-mail text-[#C9A56A] text-xs shrink-0" aria-hidden="true"></i>
                <a href="mailto:hello@vaishnavrug.com" className="hover:text-[#C9A56A] transition text-xs">hello@vaishnavrug.com</a>
              </div>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-[9px] uppercase tracking-[0.25em] text-[#C9A56A] font-bold">Shop</h4>
            <ul className="space-y-1.5 text-xs">
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
          <div className="space-y-3">
            <h4 className="font-cinzel text-[9px] uppercase tracking-[0.25em] text-[#C9A56A] font-bold">Help</h4>
            <ul className="space-y-1.5 text-xs">
              <li><NavLink to="/help/shipping" className="hover:text-[#C9A56A] transition">Shipping Policy</NavLink></li>
              <li><NavLink to="/help/returns" className="hover:text-[#C9A56A] transition">Returns & Exchanges</NavLink></li>
              <li><NavLink to="/help/care" className="hover:text-[#C9A56A] transition">Rug Care Guide</NavLink></li>
              <li><NavLink to="/help/faq" className="hover:text-[#C9A56A] transition">FAQ</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-[#C9A56A] transition">Contact Us</NavLink></li>
            </ul>
          </div>

          {/* COMPANY & Socials Column */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-cinzel text-[9px] uppercase tracking-[0.25em] text-[#C9A56A] font-bold">Company</h4>
              <ul className="space-y-1.5 text-xs">
                <li><NavLink to="/about" className="hover:text-[#C9A56A] transition">About Us</NavLink></li>
                <li><NavLink to="/about#heritage" className="hover:text-[#C9A56A] transition">Our Heritage</NavLink></li>
                <li><NavLink to="/journal" className="hover:text-[#C9A56A] transition">Journal</NavLink></li>
              </ul>
            </div>

            {/* Social square icon frames with Tabler icons */}
            <div className="flex gap-2 pt-1">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 border border-[#FAF5F0]/20 flex items-center justify-center hover:border-[#C9A56A] hover:text-[#C9A56A] transition duration-300">
                <i className="ti ti-brand-instagram text-xs" aria-label="Instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 border border-[#FAF5F0]/20 flex items-center justify-center hover:border-[#C9A56A] hover:text-[#C9A56A] transition duration-300">
                <i className="ti ti-brand-facebook text-xs" aria-label="Facebook"></i>
              </a>
              <a href="https://wa.me/918707630603" target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 border border-[#FAF5F0]/20 flex items-center justify-center hover:border-[#C9A56A] hover:text-[#C9A56A] transition duration-300">
                <i className="ti ti-brand-whatsapp text-xs" aria-label="WhatsApp"></i>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#C9A56A]/15 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#FAF5F0]/55 gap-3">
          <div className="tracking-wide">
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
