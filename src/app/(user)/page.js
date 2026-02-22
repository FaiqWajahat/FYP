
import FeaturedProducts from "@/Components/FeaturedProduct";
import LandingPage from "@/Components/LandingPage";
import Process from "@/Components/Process";
import ProductCategories from "@/Components/ProductCategries";

import ServicesTimeline from "@/Components/Services";
import StatsSection from "@/Components/Stats";
import Testimonials from "@/Components/Testimonial";

export default function Home() {
  return (
    <>
      <LandingPage/>
    <ProductCategories/>
     
      {/* <ServicesTimeline/> */}
      <Process/>
      <FeaturedProducts/>
       <StatsSection/>
      <Testimonials/>
      
    </>
  );
}
