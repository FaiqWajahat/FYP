'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import { useConfigStore } from '@/store/useConfigStore'

const FAQSection = () => {
  const setIsChatOpen = useConfigStore((state) => state.setIsChatOpen);
  // State to track which question is open
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "How does the 30-40-30 Escrow payment work?",
      answer: "We protect your funds by splitting payments into milestones. You pay 30% to start material sourcing. We release the next 40% only when the factory uploads proof of cutting/stitching. The final 30% is released after you approve the Quality Control (QC) report before shipping."
    },
    {
      question: "Do I need a Tech Pack to start an inquiry?",
      answer: "No, you don't. Our AI-Assisted Builder allows you to create a professional Tech Pack from scratch. Simply upload your sketches, select fabrics from our library, and input measurements. The system generates the technical file for the factory automatically."
    },
    {
      question: "How do you verify the Sialkot manufacturers?",
      answer: "Every factory on Factory Flow undergoes a strict 3-step verification: 1) Business Registration & Tax ID check, 2) Physical site visit to verify machinery and capacity, and 3) Review of past export performance and client references."
    },
    {
      question: "Can I order a physical sample before bulk production?",
      answer: "Yes, this is a mandatory step in our workflow. After you agree on a price, the factory produces a prototype. You must approve this sample (via high-res photos or physical shipment) before the bulk production contract becomes active."
    },
    {
      question: "What happens if the final product doesn't match my specs?",
      answer: "Since your final 30% payment is held in Escrow, you have leverage. If the goods fail the QC inspection against your Tech Pack, you can request rework or a refund. Our dispute resolution team uses the digital contract as the single source of truth."
    }
  ]

  return (
    <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-3xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
            <HelpCircle size={14} />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
            Everything you need to know.
          </h2>
          <p className="text-lg text-slate-500">
            Can’t find the answer you’re looking for? <button onClick={() => setIsChatOpen(true)} className="text-indigo-600 underline decoration-indigo-200 underline-offset-4 font-semibold hover:text-indigo-800 transition-colors">Chat with our support team.</button>
          </p>
        </div>

        {/* --- FAQ LIST --- */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                activeIndex === index 
                  ? 'border-indigo-100 shadow-lg shadow-indigo-50' 
                  : 'border-slate-200 shadow-sm hover:border-indigo-100'
              }`}
            >
              {/* Question Header (Clickable) */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`text-lg font-bold transition-colors ${activeIndex === index ? 'text-indigo-600' : 'text-slate-900'}`}>
                  {faq.question}
                </span>
                <span className={`ml-4 shrink-0 p-2 rounded-full transition-colors ${activeIndex === index ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>

              {/* Answer Content (Animated) */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FAQSection