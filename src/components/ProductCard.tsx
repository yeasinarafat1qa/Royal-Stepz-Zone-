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

  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const brand = product.brand ?? 'Royal Stepz';

  const isFeatured =
    product.isFeatured ?? product.featured ?? false;

  const isNewArrival =
    product.isNewArrival ?? product.isNew ?? false;

  const isBestseller = product.isBestseller ?? false;

  const originalPrice = product.originalPriceQAR ?? 0;
  const currentPrice = product.priceQAR ?? product.price ?? 0;

  const discountPercent =
    originalPrice > currentPrice && currentPrice > 0
      ? Math.round(
          ((originalPrice - currentPrice) / originalPrice) * 100
        )
      : 0;

  const isOutOfStock =
    product.inStock === false ||
    (typeof product.stock === 'number' && product.stock <= 0);

  const productImage =
    product.image ||
    product.images?.[0] ||
    'https://placehold.co/600x600?text=Royal+Stepz';

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (isOutOfStock) return;

    addToCart(product, selectedSize);

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleBuyNow = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (isOutOfStock) return;

    addToCart(product, selectedSize);
    setIsCartOpen(true);
  };

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
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-2xl"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <img
          src={productImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/600x600?text=Royal+Stepz';
          }}
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {/* Featured / New / Bestseller */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          {isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-black">
              <Sparkles size={12} />
              Featured
            </span>
          )}

          {isNewArrival && (
            <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-black">
              <Zap size={12} />
              New
            </span>
          )}

          {isBestseller && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">
              <Flame size={12} />
              Bestseller
            </span>
          )}
        </div>

        {/* Quick View */}
        {onQuickView && (
          <button
            type="button"
            onClick={handleQuickView}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-amber-400 hover:text-black"
          >
            <Eye size={14} />
            Quick View
          </button>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
          {brand}
        </p>

        {/* Product Name */}
        <h3 className="line-clamp-2 min-h-[48px] text-base font-bold text-white transition-colors group-hover:text-amber-400">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
                className={
                  star <= Math.round(rating)
                    ? 'text-amber-400'
                    : 'text-zinc-600'
                }
              />
            ))}
          </div>

          <span className="text-xs text-zinc-400">
            {rating > 0 ? rating.toFixed(1) : 'New'}
            {reviewCount > 0 && ` (${reviewCount})`}
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-400">
          {product.description}
        </p>

        {/* Size Selection */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">
              Size
            </span>

            <span className="text-xs text-zinc-500">
              {selectedSize}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(product.sizes?.length
              ? product.sizes
              : ['EU 42']
            ).map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                  selectedSize === size
                    ? 'border-amber-400 bg-amber-400 text-black'
                    : 'border-white/10 bg-zinc-800 text-zinc-300 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-extrabold text-white">
            QAR {currentPrice.toFixed(2)}
          </span>

          {originalPrice > currentPrice && (
            <span className="pb-0.5 text-sm text-zinc-500 line-through">
              QAR {originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
              isOutOfStock
                ? 'cursor-not-allowed bg-zinc-700 text-zinc-500'
                : isAdded
                ? 'bg-green-500 text-white'
                : 'bg-white text-black hover:bg-amber-400'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                Added
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                Add to Cart
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
              isOutOfStock
                ? 'cursor-not-allowed border-zinc-700 text-zinc-600'
                : 'border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black'
            }`}
          >
            <Zap size={16} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
