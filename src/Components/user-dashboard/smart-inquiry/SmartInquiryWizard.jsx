"use client";
import React, { useState } from 'react';
import CategorySelector from '@/Components/user-dashboard/smart-inquiry/CategorySelector';
import ProductConfigurator from '@/Components/user-dashboard/smart-inquiry/ProductConfigurator';
import InquirySuccess from '@/Components/user-dashboard/smart-inquiry/InquirySuccess';

export const CATEGORIES = [
  {
    id: 'hoodie',
    name: 'Hoodie',
    description: 'Pullover, zip-up, heavyweight & lightweight options',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    badge: 'Most Popular',
    hasZipper: true,
    hasHood: true,
  },
  {
    id: 'tshirt',
    name: 'T-Shirt',
    description: 'Crew neck, v-neck, oversized, crop & longline styles',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    badge: null,
    hasZipper: false,
    hasHood: false,
  },
  {
    id: 'polo',
    name: 'Polo Shirt',
    description: 'Classic collar, slim & regular fit, custom embroidery',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&q=80',
    badge: null,
    hasZipper: false,
    hasHood: false,
  },
  {
    id: 'jacket',
    name: 'Jacket',
    description: 'Bomber, coach, windbreaker & quilted styles',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80',
    badge: 'New',
    hasZipper: true,
    hasHood: false,
  },
  {
    id: 'sweatshirt',
    name: 'Sweatshirt',
    description: 'Crewneck, French terry & fleece, no-hood pullover',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=600&q=80',
    badge: null,
    hasZipper: false,
    hasHood: false,
  },
  {
    id: 'trackpants',
    name: 'Track Pants',
    description: 'Jogger, straight-leg, tapered & wide-leg cuts',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
    badge: null,
    hasZipper: false,
    hasHood: false,
  },
  {
    id: 'shorts',
    name: 'Shorts',
    description: 'Athletic, chino, cargo & board short styles',
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1562683069-55dbe0b5b5a6?w=600&q=80',
    badge: null,
    hasZipper: false,
    hasHood: false,
  },
  {
    id: 'cap',
    name: 'Cap / Hat',
    description: 'Snapback, dad hat, beanie & trucker styles',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&q=80',
    badge: null,
    hasZipper: false,
    hasHood: false,
  },
  {
    id: 'cargo-pants',
    name: 'Cargo Pants',
    description: 'Utility pockets, relaxed fit, streetwear & workwear',
    image: 'https://images.unsplash.com/photo-1548863227-3af567fc3b27?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    badge: 'Trending',
    hasZipper: false,
    hasHood: false,
  },
  {
    id: 'activewear-set',
    name: 'Activewear Set',
    description: 'Matching top & bottom, gym, yoga & running sets',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&q=80',
    badge: 'New',
    hasZipper: false,
    hasHood: false,
  },
  {
    id: 'vest',
    name: 'Vest / Gilet',
    description: 'Puffer, fleece & work vest styles',
    image: 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=600&q=80',
    badge: null,
    hasZipper: true,
    hasHood: false,
  },
  {
    id: 'bag',
    name: 'Bag / Tote',
    description: 'Tote, drawstring, gym bag & backpack options',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80',
    configuratorImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    badge: null,
    hasZipper: false,
    hasHood: false,
  },
];

export const DEFAULT_CONFIG = {
  // Colors
  baseColor: null,
  ribColor: null,
  zipperType: '',

  // Fabric
  fabric: '',
  fit: '',

  // Sizes
  sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, '3XL': 0 },
  sizeChartFile: null,

  // Branding
  logoFile: null,
  logoPlacements: [],
  printTechnique: '',

  // Packaging
  packaging: '',

  // Contact
  companyName: '',
  email: '',
  additionalNotes: '',
};

export default function SmartInquiryWizard() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setConfig({ ...DEFAULT_CONFIG, zipperType: category.hasZipper ? '' : 'No Zipper' });
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedCategory(null);
    setConfig(DEFAULT_CONFIG);
  };

  const handleSubmit = () => {
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCategory(null);
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="w-full min-h-full">
      {step === 1 && (
        <CategorySelector
          categories={CATEGORIES}
          onSelect={handleCategorySelect}
        />
      )}
      {step === 2 && selectedCategory && (
        <ProductConfigurator
          category={selectedCategory}
          config={config}
          setConfig={setConfig}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}
      {step === 3 && (
        <InquirySuccess
          category={selectedCategory}
          config={config}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
