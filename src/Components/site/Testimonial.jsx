'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Quote, Star, MapPin, CheckCircle2 } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// --- DATA: 9 Realistic B2B Testimonials ---
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Founder, UrbanFit UK',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    rating: 5,
    text: "Finding a reliable factory in Sialkot was hard until I found Factory Flow. The 'Smart Inquiry' tool made customization so easy. I ordered 500 hoodies and the quality is identical to top sportswear brands.",
    tag: 'Custom Production'
  },
  {
    id: 2,
    name: 'Michael Weber',
    role: 'Procurement Head',
    location: 'Berlin, Germany',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    rating: 5,
    text: "We needed 2,000 varsity jackets for a university contract. The dashboard tracking feature is a game changer—we knew exactly when stitching started and when packing finished. Delivered 3 days early.",
    tag: 'Bulk Order'
  },
  {
    id: 3,
    name: 'David Ross',
    role: 'Owner, Ross Athletics',
    location: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
    rating: 4.5,
    text: "Great communication. I was worried about the MOQs, but they accepted my order of 50 pieces to start. The fabric quality (300 GSM Fleece) was exactly as requested in the quote.",
    tag: 'Startup Friendly'
  },
  {
    id: 4,
    name: 'Elena Rodriguez',
    role: 'Design Lead, VibeWear',
    location: 'Madrid, Spain',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    rating: 5,
    text: "The sublimation printing quality on our tracksuits is vibrant and hasn't faded after 20 washes. Factory Flow is now our sole supplier for the European market.",
    tag: 'Quality Assurance'
  },
  {
    id: 5,
    name: 'James Peterson',
    role: 'CEO, GymShark Clone',
    location: 'Sydney, Australia',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop',
    rating: 4,
    text: "Shipping to Australia was faster than expected. The packaging was professional and retail-ready. Just wish the sample process was a bit faster, but the final bulk production was flawless.",
    tag: 'Logistics'
  },
  {
    id: 6,
    name: 'Fatima Al-Sayed',
    role: 'Buyer, Gulf Textiles',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
    rating: 5,
    text: "We order 10,000+ t-shirts monthly. The consistency in sizing and fabric dye is impressive. The Smart Quote system saves us days of back-and-forth emails.",
    tag: 'High Volume'
  },
  {
    id: 7,
    name: 'Liam Neeson',
    role: 'Tactical Gear Co.',
    location: 'Chicago, USA',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop',
    rating: 5,
    text: "The Cargo Trousers we customized came out perfect. The stitching is reinforced exactly where we asked. Finally, a factory that actually reads the tech packs!",
    tag: 'Technical Wear'
  },
  {
    id: 8,
    name: 'Sophie Martin',
    role: 'Eco-Fashion Brand',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    rating: 4.5,
    text: "We requested organic cotton and sustainable packaging. Factory Flow accommodated our eco-requirements without a massive price hike. Very happy.",
    tag: 'Sustainable'
  },
  {
    id: 9,
    name: 'Kenji Sato',
    role: 'Streetwear Label',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
    rating: 5,
    text: "The embroidery detail on the bomber jackets is world-class. Japanese customers are picky about quality, but these passed our inspection with flying colors.",
    tag: 'Premium Finish'
  }
];

const Testimonials = () => {
  return (
    <section className="py-24  relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-[100px]"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-2 block">
            Global Client Feedback
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
            Trusted by 500+ Brands Worldwide
          </h2>
          <p className="text-lg text-slate-500">
            From startup labels in London to major wholesalers in New York,
            see why brands choose Factory Flow for their manufacturing.
          </p>
        </div>

        {/* SWIPER SLIDER */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={false}
          loop={true}
          speed={800}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          breakpoints={{
            640: {
              slidesPerView: 1, // Mobile: 1 card
            },
            768: {
              slidesPerView: 2, // Tablet: 2 cards
            },
            1024: {
              slidesPerView: 3, // Desktop: 3 cards
            },
          }}
          className="pb-16" // Padding bottom for pagination dots
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.id} className="h-full">
              <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 h-full flex flex-col hover:border-blue-200 transition-colors duration-300">

                {/* Card Header: Rating & Quote */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(t.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}
                      />
                    ))}
                  </div>
                  <Quote size={32} className="text-blue-100 fill-blue-50" />
                </div>

                {/* Verified Tag */}
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-4">
                  <CheckCircle2 size={12} /> {t.tag}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-600 leading-relaxed mb-8 flex-grow italic">
                  "{t.text}"
                </p>

                {/* User Profile */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-auto">
                  <div className="relative">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      {/* Using a simple globe icon, but in real project use flag library */}
                      <MapPin size={12} className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                    <p className="text-[10px] text-slate-400">{t.location}</p>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

      {/* Custom Styles for Swiper Pagination to match Blue Theme */}
      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background-color: #2563eb !important; /* Tailwind blue-600 */
          width: 24px !important;
          border-radius: 4px !important;
        }
        .swiper-wrapper {
          align-items: stretch; /* Ensures all cards are same height */
        }
      `}</style>
    </section>
  );
};

export default Testimonials;