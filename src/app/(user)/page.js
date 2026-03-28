
import FeaturedProducts from "@/Components/site/FeaturedProduct";
import LandingPage from "@/Components/site/LandingPage";
import Process from "@/Components/site/Process";
import ProductCategories from "@/Components/site/ProductCategries";

import ServicesTimeline from "@/Components/site/Services";
import StatsSection from "@/Components/common/Stats";
import Testimonials from "@/Components/site/Testimonial";

export default function Home() {
  return (
    <>
      <LandingPage/>
    {/* <ProductCategories/> */}
     
      {/* <ServicesTimeline/> */}
      <Process/>
      <FeaturedProducts/>
       <StatsSection/>
      <Testimonials/>
      
    </>
  );
}
