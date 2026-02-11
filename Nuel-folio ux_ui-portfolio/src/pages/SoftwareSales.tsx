import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, ExternalLink, Loader2, AlertCircle, X, MessageCircle, Send } from 'lucide-react';
import { fetchSoftwareProducts, SoftwareProduct, formatPriceDuration } from '../services/softwareService';
import { Footer } from '../../../components/Footer';

export const SoftwareSales: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [products, setProducts] = useState<SoftwareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SoftwareProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from Supabase database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productList = await fetchSoftwareProducts();
        setProducts(productList);
        if (productList.length === 0) {
          setError('No products found. Please add products in the Supabase Dashboard.');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductClick = (product: SoftwareProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-dark-bg text-slate-200">
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg/95 to-dark-bg pointer-events-none z-0" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-gold-gradient transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-xs sm:text-sm">Back to Home</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              T3 Software Store
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              Authentic software licenses with full warranty and 24/7 technical support
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold-gradient animate-spin" />
              <span className="ml-3 text-slate-400">Loading products...</span>
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-500/50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle size={24} />
                <div>
                  <h3 className="font-bold mb-1">Error Loading Products</h3>
                  <p className="text-sm">{error}</p>
                  <p className="text-xs text-red-300 mt-2">
                    Make sure the software_products table exists and has active products.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No products available at the moment.</p>
              <p className="text-slate-500 text-sm mt-2">
                Add products in the Supabase Dashboard to see them here.
              </p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1],
                      },
                    },
                  }}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="bg-dark-card border border-white/10 rounded-xl overflow-hidden hover:border-neon-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-primary/20 hover:-translate-y-2">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-dark-surface">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%231a1a2e" width="400" height="400"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EProduct Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-neon-primary text-black px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1">
                          <ExternalLink size={14} />
                          View Details
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-gradient transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gold-gradient font-bold text-xl">{product.price}</span>
                        {product.duration && (
                          <span className="text-slate-400 text-sm">{product.duration}</span>
                        )}
                      </div>
                      {product.duration && (
                        <div className="text-xs text-slate-500 mb-3">
                          {formatPriceDuration(product.price, product.duration)}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Shield size={14} className="text-gold-gradient" />
                        <span>Full Warranty Included</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Footer Slogan */}
          {!loading && !error && products.length > 0 && (
            <div className="mt-16 text-center">
              <p className="text-2xl font-bold text-white">
                T3 - Unlock Your Creativity with Affordable Original Software
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal - Minimalist Apple Airpod Style */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <>
            {/* Backdrop - Glassmorphism */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50"
              onClick={handleBackdropClick}
            />

            {/* Modal - iOS Control Center Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.4
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={handleBackdropClick}
            >
              <div
                className="bg-black/70 backdrop-blur-xl border border-white/10 max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff20 transparent' }}
              >
                {/* Close Button - Glassmorphism Circle */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center active:scale-95"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Modal Content */}
                <div className="p-8 sm:p-12 lg:p-16">
                  {/* Product Header - Clean Grid Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
                    {/* Product Image - Prominent */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23000000" width="400" height="400"/%3E%3Ctext fill="%23ffffff" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EProduct Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>

                    {/* Product Info - High Contrast Typography */}
                    <div className="flex flex-col justify-center">
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight">
                        {selectedProduct.name}
                      </h2>
                      <div className="mb-8">
                        <div className="text-4xl sm:text-5xl font-light text-white mb-2">
                          {selectedProduct.price}
                        </div>
                        {selectedProduct.duration && (
                          <div className="text-white/60 text-lg font-light">
                            {formatPriceDuration(selectedProduct.price, selectedProduct.duration)}
                          </div>
                        )}
                      </div>
                      {selectedProduct.description && (
                        <p className="text-white/80 text-lg font-light leading-relaxed mb-12">
                          {selectedProduct.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Warranty Section - Minimalist with Thin Lines */}
                  <div className="mb-16 pt-12 border-t border-white/10">
                    <h3 className="text-2xl font-light text-white mb-8 tracking-wide">
                      T3 Software Warranty Policy
                    </h3>
                    <ul className="space-y-6">
                      <li className="flex items-start gap-4 text-white/90">
                        <span className="text-white text-sm mt-1">•</span>
                        <span className="font-light text-base leading-relaxed">Full duration warranty </span>
                      </li>
                      <li className="flex items-start gap-4 text-white/90">
                        <span className="text-white text-sm mt-1">•</span>
                        <span className="font-light text-base leading-relaxed">Genuine License supporting Adobe Firefly & Cloud Storage</span>
                      </li>
                      <li className="flex items-start gap-4 text-white/90">
                        <span className="text-white text-sm mt-1">•</span>
                        <span className="font-light text-base leading-relaxed">Data privacy (Personal Email)</span>
                      </li>
                      <li className="flex items-start gap-4 text-white/90">
                        <span className="text-white text-sm mt-1">•</span>
                        <span className="font-light text-base leading-relaxed">Technical support via AnyDesk/TeamViewer</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Buttons - Minimalist Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {/* Telegram Button - Black bg, white border, white text - Apple style */}
                    <a
                      href="https://t.me/Hean_Lyhoeng"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-[#000000] border border-white text-white px-8 py-4 font-medium rounded-full text-base hover:bg-white hover:text-black transition-all duration-300 ease-in-out active:scale-95"
                    >
                      <Send size={20} />
                      Contact on Telegram
                    </a>
                    {/* Messenger Button - White bg, no border, black text - Apple style */}
                    <a
                      href="https://web.facebook.com/lyhoeng.hean"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-medium rounded-full text-base hover:opacity-90 transition-opacity duration-300 ease-in-out active:scale-95"
                    >
                      <MessageCircle size={20} />
                      Order via Messenger
                    </a>
                  </div>

                  {/* Footer Slogan - Minimalist */}
                  <div className="text-center pt-12 border-t border-white/10">
                    <p className="text-white text-sm font-light tracking-wide">
                      T3 - Unlock Your Creativity with Affordable Original Software
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
