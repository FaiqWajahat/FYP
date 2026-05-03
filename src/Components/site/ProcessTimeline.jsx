'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { 
  PenTool, Scissors, Layers, 
  CheckCircle, Truck, Ruler
} from 'lucide-react'
import SectionHeading from '@/Components/common/SectionHeading'

const processSteps = [
  {
    id: '01',
    title: 'Design & Tech Pack',
    description: 'We translate your vision into precise technical specifications. Our engineers develop comprehensive tech packs detailing measurements, fabrics, trims, and construction methods.',
    icon: PenTool,
  },
  {
    id: '02',
    title: 'Prototyping & Sampling',
    description: 'A physical prototype is created for your review. We iterate on the fit, fabric feel, and functional details until the sample perfectly matches your expectations.',
    icon: Ruler,
  },
  {
    id: '03',
    title: 'Sourcing & Cutting',
    description: 'Premium raw materials are sourced from our network of verified global mills. The fabric is then precision-cut using automated laser technology for absolute consistency.',
    icon: Scissors,
  },
  {
    id: '04',
    title: 'Assembly & Sewing',
    description: 'Our skilled artisans assemble the garments. We utilize specialized machinery and assembly line techniques to ensure high-volume efficiency without sacrificing quality.',
    icon: Layers,
  },
  {
    id: '05',
    title: 'Quality Assurance',
    description: 'Every single unit undergoes rigorous multi-point inspection. We check for seam integrity, sizing accuracy, color consistency, and overall flawless finish.',
    icon: CheckCircle,
  },
  {
    id: '06',
    title: 'Packaging & Export',
    description: 'Garments are folded, tagged, and packaged to your brand\'s retail specifications. We handle all export logistics to deliver the shipment directly to your warehouse.',
    icon: Truck,
  }
]

const ProcessTimeline = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          first="End-to-End"
          second="Production"
          paragraph="We engineered a 6-step manufacturing pipeline ensuring quality and transparency at every milestone."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16">
          {processSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg hover:border-slate-200 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)', color: 'var(--primary)' }}
                >
                  <step.icon size={28} />
                </div>
                <span className="text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                  {step.id}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessTimeline
