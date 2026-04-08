'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ProductCard from '@/Components/site/ProductCard';
import ProductSkeleton from './ProductSkeleton';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/products?featured=true');
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Fresh off the Line
            </h2>
            <p className="mt-2 text-slate-500 font-medium max-w-xl">
              Precision-engineered base models. Customize every detail or order ready-made stock for immediate manufacturing.
            </p>
          </div>
          <Link href="/categories/all" className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors">
            View Full Catalog 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Product Grid / Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Render 4 Skeletons while loading
            Array(4).fill(0).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id || product.sku} product={product} />
            ))
          )}
        </div>

        {/* Empty State Fallback (If for some reason even newest aren't found) */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active models found in factory floor</p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/categories/all" className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-all">
            Browse All Categories
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;