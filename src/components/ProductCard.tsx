import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  Check, 
  Eye, 
  Truck,
  Sparkles
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openFastCheckout, setSelectedProduct, setIsProductDetailModalOpen, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'EU 42');
  const [isHovered, setIsHovered] = useState(false);
  const [quickAdded, setQuickAdded] = useState(false);

  const discountPercent = product.originalPriceQAR
    ? Math.round(((product.originalPriceQAR - product.priceQAR) / product.originalPriceQAR) * 100)
    : 0;

  const handleOpenDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsProductDetailModalOpen(true);
  };

  // User requested: Clicking Add to Cart opens the confirmation inter-page
  const handleAddToCartAndConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    openFastCheckout(product, selectedSize);
  };

  const handleStandardAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize);
    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 2000);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between group relative hover:shadow-2xl hover:shadow-amber-500/10"
    >
      {/* Top Image Container */}
      <div className="relative bg-slate-950/70 aspect-square overflow-hidden cursor-pointer" onClick={handleOpenDetail}>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${
            isHovered ? 'scale-108' : 'scale-100'
          }`}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-slate-950/90 border border-amber-500/40 text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded shadow backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={handleOpenDetail}
          className="absolute bottom-3 right-3 p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* 24H Delivery Chip in Qatar */}
        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
          <Truck className="w-3 h-3" />
          <span>24h Qatar Express</span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-200">{product.rating}</span>
              <span className="text-[10px] text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={handleOpenDetail}
            className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Qatar QAR Price Display */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg font-black text-amber-400 tracking-tight">
              QAR {product.priceQAR}
            </span>
            {product.originalPriceQAR && (
              <span className="text-xs text-slate-500 line-through">
                QAR {product.originalPriceQAR}
              </span>
            )}
          </div>

          {/* Size Selector Strip */}
          <div className="mt-3">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Select Size (EU):</span>
              <span className="font-bold text-slate-300">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 5).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold border transition-all ${
                    selectedSize === size
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {size.replace('EU ', '')}
                </button>
              ))}
              {product.sizes.length > 5 && (
                <button
                  onClick={handleOpenDetail}
                  className="text-[10px] px-1 text-amber-400 hover:underline"
                >
                  +{product.sizes.length - 5}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons (Amazon / Direct Confirmation) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-1.5">
          {/* Main Action: Add to Cart & Open Order Inter-Page (User Request) */}
          <button
            onClick={handleAddToCartAndConfirm}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 transition-all active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Add to Cart & Confirm (QAR {product.priceQAR})</span>
          </button>

          {/* Secondary Action: Silent Add to Bag */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleStandardAddToCart}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center justify-center gap-1 transition-colors"
            >
              {quickAdded ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 text-slate-400" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenDetail}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
