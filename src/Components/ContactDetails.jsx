'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'

const ContactDetails = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-white" />,
      title: "Email Us",
      line1: "support@factoryflow.com",
      line2: "sales@factoryflow.com",
      color: "var(--primary)"
    },
    {
      icon: <Phone className="w-6 h-6 text-white" />,
      title: "Call & WhatsApp",
      line1: "+92 52 123 4567",
      line2: "+92 300 987 6543",
      color: "var(--secondary)"
    },
    {
      icon: <MapPin className="w-6 h-6 text-white" />,
      title: "Visit HQ",
      line1: "Software Technology Park,",
      line2: "Small Industrial Estate, Sialkot",
      color: "var(--primary)"
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Support Hours",
      line1: "Mon-Sat: 9am - 6pm (PKT)",
      line2: "24/7 Inquiry Submission",
      color: "var(--secondary)"
    }
  ]

  return (
    <section className="py-20 px-6 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon Bubble */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-500 font-medium text-sm">
                {item.line1}
              </p>
              <p className="text-slate-500 font-medium text-sm">
                {item.line2}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default ContactDetails