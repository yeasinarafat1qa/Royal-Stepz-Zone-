import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

import {
  Star,
  ShoppingBag,
  Zap,
  Check,
  Eye,
  Sparkles,
  Flame,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
}) => {
  const { addToCart, setIsCartOpen } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || 'EU 42'
  );

  const [isAdded, setIsAdded] = useState(false);

  // Calculate discount safely
  const discountPercent =
    product.originalPriceQAR &&
    product.originalPriceQAR > product.priceQAR
      ? Math.round(
          ((product.originalPriceQAR - product.priceQAR) /
            product.originalPriceQAR) *
            100
        )
      : 0;

  // Add to cart
  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    addToCart(product, selectedSize);

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  // Buy now
  const handleBuyNow = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    addToCart(product, selectedSize);
    setIsCartOpen(true);
  };

  // Quick view
  const handleQuickView = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      onClick={() => onQuickView?.(product)}
      className="
        group relative
        bg-slate-900/80
        border border-slate-800/80
        hover:border-amber-500/40
        rounded-2xl
        overflow-hidden
        transition-all duration-300
        hover:shadow-xl
        hover:shadow-amber-500/5
        flex flex-col
        justify-between
        cursor-pointer
      "
    >
      {/* ================= PRODUCT IMAGE ================= */}
      <div className="relative aspect-square overflow-hidden bg-slate-950">

        {/* Hover View Details */}
        <div
          className="
            absolute inset-0
            bg-black/20
            opacity-0
            group-hover:opacity-100
            transition-opacity
            z-10
            flex items-center justify-center
            pointer-events-none
          "
        >
          <span
            className="
              px-3 py-1.5
              bg-slate-950/80
              text-amber-400
              text-xs font-bold
              rounded-full
              border border-amber-500/30
              backdrop-blur-sm
              flex items-center gap-1.5
              shadow-lg
            "
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </span>
        </div>

        {/* ================= BADGES ================= */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5">

          {product.isFeatured && (
            <span
              className="
                inline-flex items-center gap-1
                bg-amber-500
                text-slate-950
                font-black
                text-[10px]
                uppercase
                px-2 py-0.5
                rounded-full
                shadow-md
              "
            >
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}

          {product.isBestseller && (
            <span
              className="
                inline-flex items-center gap-1
                bg-gradient-to-r
                from-red-500 to-orange-500
                text-white
                font-black
                text-[10px]
                uppercase
                px-2 py-0.5
                rounded-full
                shadow-md
              "
            >
              <Flame className="w-3 h-3" />
              Bestseller
            </span>
          )}

          {discountPercent > 0 && (
            <span
              className="
                bg-red-500/90
                text-white
                font-black
                text-[10px]
                px-2 py-0.5
                rounded-full
                shadow-md
              "
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* ================= QUICK VIEW BUTTON ================= */}
        {onQuickView && (
          <button
            type="button"
            onClick={handleQuickView}
            className="
              absolute top-2.5 right-2.5
              z-30
              p-2
              rounded-full
              bg-slate-900/80
              hover:bg-amber-500
              text-slate-300
              hover:text-slate-950
              backdrop-blur-md
              transition-all
              opacity-0
              group-hover:opacity-100
              shadow-md
              cursor-pointer
            "
            title="View Details"
            aria-label="View product details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="
            w-full h-full
            object-cover object-center
            group-hover:scale-105
            transition-transform duration-500
          "
          loading="lazy"
        />
      </div>

      {/* ================= PRODUCT INFORMATION ================= */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">

        {/* Product Title / Brand / Rating */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">

            <span
              className="
                font-mono
                text-amber-400
                font-semibold
                tracking-wider
                uppercase
                text-[11px]
              "
            >
              {product.brand}
            </span>

            <div
              className="
                flex items-center gap-1
                text-slate-400
                text-[11px]
              "
            >
              <Star
                className="
                  w-3 h-3
                  text-amber-400
                  fill-amber-400
                "
              />

              <span>{product.rating}</span>

              <span className="text-slate-600">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <h3
            className="
              font-bold
              text-white
              text-sm
              line-clamp-1
              group-hover:text-amber-400
              transition-colors
            "
          >
            {product.name}
          </h3>

          <p
            className="
              text-slate-400
              text-xs
              line-clamp-2
              mt-1
              leading-relaxed
            "
          >
            {product.description}
          </p>
        </div>

        {/* ================= SIZE SELECTION ================= */}
        <div>
          <div
            className="
              text-[11px]
              text-slate-400
              mb-1.5
              flex
              items-center
              justify-between
              font-medium
            "
          >
            <span>Size (EU):</span>

            <span className="text-amber-400 font-bold">
              {selectedSize}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {(product.sizes || []).map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`
                  text-[10px]
                  font-bold
                  px-2 py-1
                  rounded-md
                  transition-all
                  cursor-pointer

                  ${
                    selectedSize === size
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ================= PRICE & ACTIONS ================= */}
        <div className="pt-2 border-t border-slate-800/80">

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">

            <span className="text-lg font-black text-white">
              QAR {product.priceQAR}
            </span>

            {product.originalPriceQAR &&
              product.originalPriceQAR > product.priceQAR && (
                <span
                  className="
                    text-xs
                    text-slate-500
                    line-through
                    font-medium
                  "
                >
                  QAR {product.originalPriceQAR}
                </span>
              )}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`
                py-2
                px-2.5
                rounded-xl
                text-xs
                font-bold
                flex
                items-center
                justify-center
                gap-1.5
                transition-all
                cursor-pointer

                ${
                  isAdded
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }
              `}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>

            {/* Order Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="
                py-2
                px-2.5
                rounded-xl
                text-xs
                font-black
                bg-gradient-to-r
                from-amber-500
                to-yellow-500
                hover:from-amber-400
                hover:to-yellow-400
                text-slate-950
                flex
                items-center
                justify-center
                gap-1
                shadow-md
                shadow-amber-500/10
                cursor-pointer
                transition-transform
                active:scale-95
              "
            >
              <Zap
                className="
                  w-3.5 h-3.5
                  fill-slate-950
                "
              />

              <span>Order Now</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
