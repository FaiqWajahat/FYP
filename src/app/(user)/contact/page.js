import ContactDetails from '@/Components/ContactDetails'
import ContactHero from '@/Components/ContactHero'
import CTA from '@/Components/CTA'
import FAQSection from '@/Components/Faqs'
import { Contact } from 'lucide-react'
import React from 'react'

const ConatctPage = () => {
  return (
    <div>
    <ContactHero/>
    <ContactDetails/>
    <FAQSection/>
    <CTA/>
    </div>
  )
}

export default ConatctPage