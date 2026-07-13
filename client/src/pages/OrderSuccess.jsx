import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/ui/ScrollReveal'

export default function OrderSuccess() {
  const { id } = useParams()

  return (
    <div className="py-32 bg-offwhite min-h-screen text-center font-jost">
      <div className="container max-w-[500px] mx-auto px-4 space-y-6">
        
        <ScrollReveal direction="up" className="text-gold">
          <CheckCircle2 className="w-16 h-16 mx-auto stroke-[1.5]" />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1} className="space-y-3">
          <span className="font-cinzel text-xs tracking-[0.2em] text-gold uppercase font-bold">Transaction Confirmed</span>
          <h1 className="font-cormorant text-3xl text-navy font-bold">Order Placed Successfully!</h1>
          <p className="text-sm text-charcoal/80 max-w-sm mx-auto leading-relaxed font-light">
            Thank you for shopping with Vaishnav Rug Collection. Your order details and tracking milestones have been sent to your email.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2} className="bg-white border border-border/40 p-5 rounded-none max-w-xs mx-auto">
          <span className="text-[10px] text-muted uppercase font-cinzel block mb-1">Order Reference Number</span>
          <span className="font-mono text-sm font-bold text-navy">{id}</span>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3} className="pt-4 flex justify-center gap-4">
          <Link to="/shop">
            <Button variant="primary">Continue Gallery</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </ScrollReveal>

      </div>
    </div>
  )
}
