'use client'
import React, { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { PenTool, FileCheck, CreditCard, Factory } from 'lucide-react'
import SectionHeading from '@/Components/common/SectionHeading'

export default function ServicesTimeline() {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  })

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut', delay: i * 0.2 },
    }),
  }

  // UPDATED: Steps match your exact request
  const services = [
    {
      step: '01',
      title: 'Customization',
      subtitle: 'Smart Tech-Pack Builder',
      description:
        'Use our AI-assisted builder to customize your apparel. Select fabrics, upload design sketches, and define measurements. [cite_start]The system automatically converts your inputs into a professional industry-standard Tech Pack[cite: 35].',
      icon: <PenTool className="h-8 w-8 text-white" />,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      borderColor: 'border-indigo-500',
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-700',
    },
    {
      step: '02',
      title: 'Design Finalization',
      subtitle: 'Digital Negotiation & Samples',
      description:
        'Receive quotes from verified factories. Negotiate price and lead time digitally. Once agreed, request a physical sample. [cite_start]The design is only "Finalized" when you approve the sample photos or physical shipment[cite: 145, 151].',
      icon: <FileCheck className="h-8 w-8 text-white" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      borderColor: 'border-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      step: '03',
      title: 'Payment',
      subtitle: '30-40-30 Milestone Escrow',
      description:
        'Your funds are secure. Pay a 30% advance to start material sourcing. [cite_start]Release 40% when production hits the stitching phase, and the final 30% only after the goods pass Quality Control and are ready for dispatch[cite: 60, 124, 127, 132].',
      icon: <CreditCard className="h-8 w-8 text-white" />,
      color: 'bg-gradient-to-br from-teal-500 to-teal-700',
      borderColor: 'border-teal-500',
      bgLight: 'bg-teal-50',
      textColor: 'text-teal-700',
    },
    {
      step: '04',
      title: 'Production Phases',
      subtitle: 'Live Tracking Dashboard',
      description:
        'Monitor your order as it moves through the factory floor. [cite_start]Get real-time status updates and photo evidence for Cutting, Stitching, Quality Control (QC), and Packing—eliminating the need for constant follow-ups[cite: 61, 146, 152].',
      icon: <Factory className="h-8 w-8 text-white" />,
      color: 'bg-gradient-to-br from-slate-600 to-slate-800',
      borderColor: 'border-slate-600',
      bgLight: 'bg-slate-100',
      textColor: 'text-slate-800',
    },
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden font-sans">
      
      {/* Section Heading */}
      <SectionHeading 
        first={'Our'} 
        second={'Process'} 
        paragraph={
          'A transparent, digitized workflow designed to give you complete control from the first sketch to the final shipment.'
        } 
      />

      {/* Timeline Container */}
      <div ref={ref} className="relative max-w-6xl mx-auto px-6 mt-16">
        
        {/* Vertical Center Line */}
        <div className="absolute hidden lg:block left-1/2 transform -translate-x-1/2 h-full">
          <div className="w-1 h-full bg-slate-100 rounded-full"></div>
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute top-0 w-1 bg-gradient-to-b from-indigo-500 via-teal-500 to-slate-800 rounded-full origin-top"
            initial={{ scaleY: 0 }}
          />
        </div>

        {/* Timeline Items */}
        <div className="relative flex flex-col gap-20">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-10 ${
                idx % 2 === 0 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              
              {/* Content Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 w-full lg:w-5/12 group"
              >
                <div className="flex items-start mb-4 gap-4">
                  {/* Step Number Badge */}
                  <div
                    className={`shrink-0 w-14 h-14 ${service.bgLight} ${service.borderColor} border rounded-2xl flex items-center justify-center`}
                  >
                    <span
                      className={`font-black text-xl ${service.textColor}`}
                    >
                      {service.step}
                    </span>
                  </div>
                  
                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {service.title}
                    </h3>
                    <p
                      className={`text-xs font-bold ${service.textColor} uppercase tracking-widest mt-1`}
                    >
                      {service.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-500 leading-relaxed text-sm">
                  {service.description}
                </p>
              </motion.div>

              {/* Center Icon Node */}
              <div className="lg:absolute left-1/2 lg:transform lg:-translate-x-1/2 z-10 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center shadow-[0_0_0_8px_rgba(255,255,255,1)] mx-auto lg:mx-0 ring-1 ring-slate-100`}
                >
                  {service.icon}
                </motion.div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}