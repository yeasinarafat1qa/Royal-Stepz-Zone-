```tsx
import React, { useEffect, useMemo, useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SecretAdminModal } from './components/SecretAdminModal';
import { OrderConfirmModal } from './components/OrderConfirmModal';
import { NotificationsModal } from './components/NotificationsModal';

import { Product } from './types';

import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react';

function StoreContent() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    searchQuery,
    isAdminOpen,
    setIsAdminOpen,
    isOrderConfirmModalOpen,
    addToCart,
    user,
  } = useStore();

  const [sortBy, setSortBy] = useState<
    'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'
  >('featured');

  const [priceRange] = useState<[number, number]>([0, 1500]);
  const [showDiscountsOnly, setShowDiscountsOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState(false);

  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [detailsSelectedSize, setDetailsSelectedSize] = useState<string>('');
  const [detailsAdded, setDetailsAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'F12') {
        e.preventDefault();

        if (user?.isAdmin) {
          setIsAdminOpen(true);
        } else {
          setIsSecretAdminModalOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user, setIsAdminOpen]);

  const brands = useMemo(() => {
    const brandSet = new Set<string>();

    products.forEach((product) => {
      if (product.brand) {
        brandSet.add(product.brand);
      }
    });

    return ['All', ...Array.from(brandSet)];
  }, [products]);

  const categories = [
    'All',
    'Sneakers',
    'Casual',
    'Running',
    'Luxury',
    'Slides',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (
          selectedCategory !== 'All' &&
          product.category !== selectedCategory
        ) {
          return false;
        }

        if (
          selectedBrand !== 'All' &&
          product.brand !== selectedBrand
        ) {
          return false;
        }

        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();

          const matchName = product.name
            ?.toLowerCase()
            .includes(query);

          const matchBrand = product.brand
            ?.toLowerCase()
            .includes(query);

          const matchCategory = product.category
            ?.toLowerCase()
            .includes(query);

          const matchDescription = product.description
            ?.toLowerCase()
            .includes(query);

          if (
            !matchName &&
            !matchBrand &&
            !matchCategory &&
            !matchDescription
          ) {
            return false;
          }
        }

        if (
          product.priceQAR < priceRange[0] ||
          product.priceQAR > priceRange[1]
        ) {
          return false;
        }

        if (
          showDiscountsOnly &&
          (!product.originalPriceQAR ||
            product.originalPriceQAR <= product.priceQAR)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return a.priceQAR - b.priceQAR;
        }

        if (sortBy === 'price-high') {
          return b.priceQAR - a.priceQAR;
        }

        if (sortBy === 'rating') {
          return (b.rating ?? 0) - (a.rating ?? 0);
        }

        if (sortBy === 'newest') {
          return (
            Number(Boolean(b.isNewArrival)) -
            Number(Boolean(a.isNewArrival))
          );
        }

        return (
          Number(Boolean(b.isFeatured)) -
          Number(Boolean(a.isFeatured))
        );
      });
  }, [
    products,
    selectedCategory,
    selectedBrand,
    searchQuery,
    priceRange,
    showDiscountsOnly,
    sortBy,
  ]);

  const openProductDetails = (product: Product) => {
    setDetailsProduct(product);
    setDetailsSelectedSize(product.sizes?.[0] || 'EU 42');
    setDetailsAdded(false);
  };

  const closeProductDetails = () => {
    setDetailsProduct(null);
    setDetailsSelectedSize('');
    setDetailsAdded(false);
  };

  const handleAddDetailsProduct = () => {
    if (!detailsProduct) return;

    const size =
      detailsSelectedSize ||
      detailsProduct.sizes?.[0] ||
      'EU 42';

    addToCart(detailsProduct, size);
    setDetailsAdded(true);

    window.setTimeout(() => {
      setDetailsAdded(false);
      setDetailsProduct(null);
      setDetailsSelectedSize('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
              <Sparkles className="h-4 w-4" />
              Premium Footwear in Qatar
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              Step Into Royalty.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Premium footwear for every step. Discover your next
              favourite pair at Royal Stepz Zone.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  document
                    .getElementById('shop')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="rounded-xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400"
              >
                Shop Collection
              </button>

              <button
                onClick={() =>
                  setSelectedCategory('Sneakers')
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-bold text-white transition hover:border-amber-500"
              >
                Explore Sneakers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <section className="border-b border-slate-800 bg-slate-900/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-amber-400" />
            <div>
              <p className="font-semibold">Fast Delivery</p>
              <p className="text-xs text-slate-400">Across Qatar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-amber-400" />
            <div>
              <p className="font-semibold">Quality Guaranteed</p>
              <p className="text-xs text-slate-400">Premium products</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="h-6 w-6 text-amber-400" />
            <div>
              <p className="font-semibold">Easy Support</p>
              <p className="text-xs text-slate-400">Customer friendly</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Headphones className="h-6 w-6 text-amber-400" />
            <div>
              <p className="font-semibold">WhatsApp Support</p>
              <p className="text-xs text-slate-400">
                +974 3040 8610
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop */}
      <main
        id="shop"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Royal Collection
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Shop Footwear
            </h2>

            <p className="mt-2 text-slate-400">
              {filteredProducts.length} product
              {filteredProducts.length === 1 ? '' : 's'} available
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                setIsFilterDrawerOpen((prev) => !prev)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold hover:border-amber-500"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | 'featured'
                      | 'price-low'
                      | 'price-high'
                      | 'rating'
                      | 'newest'
                  )
                }
                className="appearance-none rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-4 pr-10 text-sm font-semibold text-white outline-none focus:border-amber-500"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
                <option value="rating">Top Rated</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        {isFilterDrawerOpen && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">
                  Category
                </p>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(category)
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        selectedCategory === category
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">
                  Brand
                </p>

                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        selectedBrand === brand
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={showDiscountsOnly}
                onChange={(e) =>
                  setShowDiscountsOnly(e.target.checked)
                }
                className="h-4 w-4 accent-amber-500"
              />
              Show discounted products only
            </label>
          </div>
        )}

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProductDetails(product)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
            <p className="text-xl font-bold text-white">
              No products found
            </p>

            <p className="mt-2 text-slate-400">
              Try another search, category, or brand.
            </p>

            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setShowDiscountsOnly(false);
              }}
              className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-slate-950 hover:bg-amber-400"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer />
      <AuthModal />

      <SecretAdminModal
        isOpen={isSecretAdminModalOpen}
        onClose={() => setIsSecretAdminModalOpen(false)}
        onLoginSuccess={() => {
          setIsSecretAdminModalOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {isAdminOpen && <AdminDashboard />}

      {isOrderConfirmModalOpen && <OrderConfirmModal />}

      <NotificationsModal />

      {/* Product Details Modal */}
      {detailsProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <button
              onClick={closeProductDetails}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-950/80 p-2 text-slate-300 hover:text-white"
              aria-label="Close product details"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="aspect-square bg-slate-800">
                <img
                  src={
                    detailsProduct.image ||
                    detailsProduct.images?.[0]
                  }
                  alt={detailsProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                {detailsProduct.brand && (
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                    {detailsProduct.brand}
                  </p>
                )}

                <h3 className="mt-2 text-2xl font-black text-white">
                  {detailsProduct.name}
                </h3>

                <p className="mt-4 text-slate-400">
                  {detailsProduct.description}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <span className="text-2xl font-black text-amber-400">
                    QAR {detailsProduct.priceQAR.toFixed(2)}
                  </span>

                  {detailsProduct.originalPriceQAR &&
                    detailsProduct.originalPriceQAR >
                      detailsProduct.priceQAR && (
                      <span className="text-sm text-slate-500 line-through">
                        QAR{' '}
                        {detailsProduct.originalPriceQAR.toFixed(
                          2
                        )}
                      </span>
                    )}
                </div>

                {detailsProduct.sizes?.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-3 text-sm font-semibold text-slate-300">
                      Select Size
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {detailsProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setDetailsSelectedSize(size)
                          }
                          className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                            detailsSelectedSize === size
                              ? 'border-amber-500 bg-amber-500 text-slate-950'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-amber-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {detailsProduct.colors?.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-sm font-semibold text-slate-300">
                      Available Colors
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {detailsProduct.colors.map((color) => (
                        <span
                          key={color}
                          className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddDetailsProduct}
                  disabled={detailsAdded}
                  className="mt-7 w-full rounded-xl bg-amber-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {detailsAdded
                    ? 'Added to Cart ✓'
                    : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}

export default App;
```
