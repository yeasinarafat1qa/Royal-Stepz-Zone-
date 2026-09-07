import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  ArrowRight,
  Zap
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, openFastCheckout, products } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: '🇶🇦 QATAR EXCLUSIVE DROP',
      title: 'ROYAL STEPZ COLLECTION',
      subtitle: 'Luxury Streetwear & High-Performance Sneakers in Doha',
      description: 'Discover the premier footwear destination in Qatar. 100% authentic designer sneakers, handcrafted formal loafers, and ultra-comfort slides.',
      cta: 'Explore Sneakers',
      category: 'Sneakers',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1400&q=85',
      featuredPrice: 'Starting from QAR 350',
    },
    {
      badge: '✨ MAJLIS & EXECUTIVE ELEGANCE',
      title: 'HANDCRAFTED LOAFERS',
      subtitle: 'Premium Italian Calfskin & Signature Gold Hardware',
      description: 'Engineered for luxury comfort and regal prestige. Ideal for Qatar business executives, formal events, and special occasions.',
      cta: 'Shop Formal & Loafers',
      category: 'Loafers',
      image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1400&q=85',
      featuredPrice: 'Starting from QAR 490',
    },
    {
      badge: '⚡ FLASH SALE • 24H DELIVERY',
      title: 'DOHA RUNNING & CASUALS',
      subtitle: 'Ultralight Breathable Comfort for Qatar Weather',
      description: 'Special summer discount up to 35% OFF. Same-day & 24-hour fast delivery across Doha, Lusail, Al Rayyan & Al Wakrah.',
      cta: 'View Deals',
      category: 'Running',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85',
      featuredPrice: 'Special Deal QAR 350',
    }
  ];

  // Auto advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  const handleCategoryNav = (cat: string) => {
    setSelectedCategory(cat);
    const catalog = document.getElementById('catalog-section');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-slate-950 overflow-hidden">
      {/* Background Graphic & Slide Carousel */}
      <div className="relative min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex items-center">
        {/* Background Image with Dark & Gold Gradients */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{ backgroundImage: `url(${activeSlide.image})` }}
        >
          {/* Overlays for Amazon/Luxury feel */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Slide Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 w-full">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {activeSlide.title}
            </h1>

            <p className="mt-2 text-base sm:text-lg font-semibold text-amber-300">
              {activeSlide.subtitle}
            </p>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3">
              {activeSlide.description}
            </p>

            <div className="mt-3 text-sm font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {activeSlide.featuredPrice}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleCategoryNav(activeSlide.category)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <span>{activeSlide.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const firstProduct = products[0];
                  if (firstProduct) openFastCheckout(firstProduct);
                }}
                className="px-5 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold rounded-lg border border-slate-700 backdrop-blur-md transition-colors text-sm flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Instant Qatar Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition-colors z-20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition-colors z-20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-600'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Amazon 4-Tile Quick Categories Section (Overlapping Hero) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Tile 1 */}
          <div 
            onClick={() => handleCategoryNav('Sneakers')}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 sm:p-4 shadow-xl cursor-pointer group transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Streetwear</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Hot</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Trending Sneakers
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Retro high tops & skate dunks</p>
            <div className="mt-3 overflow-hidden rounded-lg h-24 sm:h-28 bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80" 
                alt="Sneakers" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-2 text-xs font-semibold text-amber-400 flex items-center justify-between">
              <span>Explore Collection</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tile 2 */}
          <div 
            onClick={() => handleCategoryNav('Loafers')}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 sm:p-4 shadow-xl cursor-pointer group transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Majlis & Formal</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Luxury</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Handcrafted Loafers
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Italian calfskin horsebit loafers</p>
            <div className="mt-3 overflow-hidden rounded-lg h-24 sm:h-28 bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=400&q=80" 
                alt="Loafers" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-2 text-xs font-semibold text-amber-400 flex items-center justify-between">
              <span>View Luxury</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tile 3 */}
          <div 
            onClick={() => handleCategoryNav('Running')}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 sm:p-4 shadow-xl cursor-pointer group transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Athletic</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">24H Doha</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Running & Sport
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Lightweight breathability</p>
            <div className="mt-3 overflow-hidden rounded-lg h-24 sm:h-28 bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" 
                alt="Running" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-2 text-xs font-semibold text-amber-400 flex items-center justify-between">
              <span>Shop Sports</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tile 4 */}
          <div 
            onClick={() => handleCategoryNav('Slides & Sandals')}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 sm:p-4 shadow-xl cursor-pointer group transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Comfort</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Best Value</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Cloud Slide Sandals
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Relaxed ergonomic lounging</p>
            <div className="mt-3 overflow-hidden rounded-lg h-24 sm:h-28 bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=400&q=80" 
                alt="Slides" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-2 text-xs font-semibold text-amber-400 flex items-center justify-between">
              <span>Browse Slides</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
