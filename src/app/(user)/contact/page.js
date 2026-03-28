import ContactDetails from '@/Components/site/ContactDetails'
import ContactHero from '@/Components/site/ContactHero'
import CTA from '@/Components/site/CTA'
import FAQSection from '@/Components/site/Faqs'
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