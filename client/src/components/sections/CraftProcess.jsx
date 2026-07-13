import React from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../ui/ScrollReveal'
import weaverHandsImg from '../../assets/weaver_hands.jpg'

export default function CraftProcess() {
  const steps = [
    { num: '1', label: <>Design &<br />Pattern</> },
    { num: '2', label: <>Natural<br />Dyeing</> },
    { num: '3', label: <>Hand-<br />Knotting</> },
    { num: '4', label: <>Washing &<br />Finishing</> },
    { num: '5', label: <>Quality<br />Check</> }
  ]

  return (
    <section className="craft" role="region" aria-label="Our heritage and craft story">
      <ScrollReveal direction="left" className="w-full">
        <div className="craft-img h-full min-h-[350px] lg:min-h-[520px] relative">
          <img 
            src={weaverHandsImg} 
            alt="Master artisan hand-knotting a traditional rug on a loom in Bhadohi" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-[#160400]/40 pointer-events-none" />
        </div>
      </ScrollReveal>

      {/* Right side: Story & Steps list */}
      <div className="craft-content">
        <ScrollReveal direction="up">
          <div className="craft-lbl">OUR HERITAGE</div>
          <h2 className="craft-h2">
            Every Knot <em>Tells a Story.</em>
          </h2>
          <p className="craft-p">
            Rooted in Bhadohi's 400-year carpet tradition, each Vaishnav rug is the result of weeks of careful hand-knotting by master weavers who have inherited the craft across generations. We bring this timeless art to modern homes.
          </p>
        </ScrollReveal>

        {/* Steps Grid */}
        <div className="craft-steps">
          {steps.map((step, idx) => (
            <ScrollReveal key={step.num} direction="up" delay={idx * 0.05}>
              <div className="cs">
                <div className="cs-n">{step.num}</div>
                <div className="cs-l">{step.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Story Link */}
        <ScrollReveal direction="up" delay={0.3}>
          <Link to="/about" className="craft-link uppercase font-bold tracking-wider">
            OUR STORY
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
