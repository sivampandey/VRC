import React from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../ui/ScrollReveal'

export default function CustomOrderCTA() {
  const steps = [
    { 
      num: '1', 
      title: 'CHOOSE SIZE & DESIGN', 
      desc: 'Pick your dimensions, material, and pattern style' 
    },
    { 
      num: '2', 
      title: 'SHARE REQUIREMENTS', 
      desc: 'Upload references, describe your vision and budget' 
    },
    { 
      num: '3', 
      title: 'GET YOUR QUOTE', 
      desc: 'We respond within 24 hours with pricing and timeline' 
    }
  ]

  return (
    <section className="cta-bg" role="region" aria-label="Custom rug order">
      <div className="container max-w-[1200px] mx-auto relative z-10">
        <ScrollReveal direction="up">
          <div className="cta-lbl">BESPOKE RUGS</div>
          <h2 className="cta-h2">Can't find what you're looking for?</h2>
          <p className="cta-p">
            We craft rugs to your exact size, colour, and design. Get a personalized quote within 24 hours from our master weavers in Bhadohi.
          </p>
        </ScrollReveal>

        <div className="cta-steps mt-12 mb-12">
          {steps.map((step, idx) => (
            <ScrollReveal key={step.num} direction="up" delay={idx * 0.05} className="w-full md:w-auto flex-1 flex justify-center">
              <div className="cta-step">
                <div className="cta-sc">{step.num}</div>
                <div className="cta-sn">{step.title}</div>
                <div className="cta-sd">{step.desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Buttons */}
        <ScrollReveal direction="up" delay={0.25}>
          <div className="cta-btns">
            <Link to="/custom-order">
              <button className="btn-g">
                START CUSTOM ORDER &nbsp;<i className="ti ti-arrow-right" aria-hidden="true"></i>
              </button>
            </Link>
            <a href="https://wa.me/918707630603" target="_blank" rel="noopener noreferrer">
              <button className="btn-wa">
                <i className="ti ti-brand-whatsapp text-lg" aria-hidden="true"></i> CHAT ON WHATSAPP
              </button>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
