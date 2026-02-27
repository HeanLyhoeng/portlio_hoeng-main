import React, { useState, useEffect } from 'react';
import { Menu, X, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// SVGs for Mobile Menu Socials
const SocialIcon = ({ path }: { path: string }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d={path} />
  </svg>
);

const facebookPath = "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const telegramPath = "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z";
const youtubePath = "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .5 6.186C0 8.07 0 12 0 12s0 3.93.5 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.5-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#/', isPage: true, isHome: true },
    { name: 'View Work', href: '#work', isPage: false },
    { name: 'Our Services', href: '#/services', isPage: true },
    { name: 'Software Sales', href: '#/software-sales', isPage: true },
    { name: 'About Us', href: '#/about', isPage: true },
    { name: 'Pricing', href: '#/pricing', isPage: true },
  ];

  // Navigation handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isPage: boolean, isHome?: boolean) => {
    e.preventDefault();
    try {
      if (isHome) {
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      } else if (isPage) {
        window.location.hash = href;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const currentHash = window.location.hash;
        const isOnDifferentPage = currentHash && (currentHash.startsWith('#/project/') || currentHash.startsWith('#/design/') || currentHash === '#/about' || currentHash === '#/services' || currentHash === '#/software-sales' || currentHash === '#/pricing');

        if (isOnDifferentPage) {
          window.location.hash = '';
          setTimeout(() => {
            try {
              window.location.hash = href;
              // Safe query selector
              if (href && href.startsWith('#') && !href.includes('/')) {
                const element = document.querySelector(href);
                if (element) {
                  const headerOffset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }
            } catch (err) {
              console.error("Navigation error after timeout:", err);
            }
          }, 300);
        } else {
          window.location.hash = href;
          if (href && href.startsWith('#') && !href.includes('/')) {
            const element = document.querySelector(href);
            if (element) {
              const headerOffset = 80;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback: just try to set location hash if everything else fails
      window.location.hash = href;
    }
  };

  // Handle Contact Button Click (Works from any page)
  const handleContactClick = () => {
    try {
      setIsMobileMenuOpen(false); // Close mobile menu if open
      window.open('https://t.me/Hean_Lyhoeng', '_blank');
    } catch (error) {
      console.error("Contact navigation error:", error);
    }
  };

  const menuVariants = {
    closed: {
      y: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 35,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0, filter: "blur(10px)" },
    open: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  // Apple-style glassmorphism background
  const glassBg = 'rgba(0, 0, 0, 0.7)';

  const textColor = 'rgba(255, 255, 255, 0.8)'; // Made slightly brighter for visibility on black

  const textColorHover = 'rgba(255, 255, 255, 1)';

  return (
    <>
      {/* z-50 ensures nav stays above Hero and all sections so About, Services, etc. remain clickable */}
      <header
        className="fixed top-0 left-0 z-50 w-full bg-black/90 backdrop-blur-md transition-all duration-300 py-4"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo - Minimal Apple style, smaller */}
            <a
              href="#/"
              className="flex items-center gap-2 group text-xs sm:text-sm font-medium tracking-wide transition-opacity duration-300 hover:opacity-80 text-white"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img
                src="https://jqszlmcwearhovsjknat.supabase.co/storage/v1/object/public/avatars/freepik__a-white-abstract-cube-logo-is-centered-on-a-black-__84990.png"
                alt="LYHOENG-DESIGN Logo"
                className="w-8 h-8 object-contain rounded-md"
                loading="eager"
                decoding="async"
              />
              <span>LYHOENG-DESIGN</span>
            </a>

            {/* Desktop Nav - hidden on mobile/tablet; visible lg+ */}
            <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.isPage, link.isHome)}
                  className="text-[12px] xl:text-[13px] font-normal tracking-[0.02em] transition-all duration-300 ease-in-out"
                  style={{
                    color: textColor,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = textColorHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = textColor;
                  }}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Contact Button & Mobile Toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Contact Button - Apple style pill, smaller */}
              <button
                onClick={handleContactClick}
                className="hidden lg:block px-4 py-1 rounded-full text-[12px] font-medium transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 1)',
                  color: 'rgba(0, 0, 0, 1)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Contact Me
              </button>

              {/* Hamburger: visible on mobile/tablet only (block lg:hidden); min 44px touch target */}
              <button
                className="block lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 -m-1 transition-opacity duration-300 hover:opacity-70"
                style={{ color: textColorHover }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Apple style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[999] lg:hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Drawer - full screen overlay, large touch targets */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed inset-0 z-[1000] lg:hidden pt-20 pb-8 px-4 md:px-8 overflow-y-auto max-h-screen"
              style={{
                background: glassBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    variants={itemVariants}
                    className="text-base md:text-lg font-normal tracking-wide min-h-[48px] flex items-center py-4 px-4 rounded-lg transition-all duration-300"
                    style={{
                      color: textColor,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = textColorHover;
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={(e) => {
                      handleNavClick(e, link.href, link.isPage, link.isHome);
                      if (!link.isHome) {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    {link.name}
                  </motion.a>
                ))}

                {/* Contact Info Section in Mobile Menu */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 pt-6 border-t"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <h4
                    className="text-xs font-medium mb-4 uppercase tracking-wider"
                    style={{ color: textColor }}
                  >
                    Get in Touch
                  </h4>

                  <div className="space-y-3">
                    <a
                      href="mailto:Lyhoenghean24@gmail.com"
                      className="flex items-center gap-3 text-sm transition-opacity duration-300 hover:opacity-80"
                      style={{ color: textColor }}
                    >
                      <Mail size={16} />
                      <span>Lyhoenghean24@gmail.com</span>
                    </a>
                    <a
                      href="tel:+85566910817"
                      className="flex items-center gap-3 text-sm transition-opacity duration-300 hover:opacity-80"
                      style={{ color: textColor }}
                    >
                      <Phone size={16} />
                      <span>+855 66 910 817</span>
                    </a>
                  </div>

                  {/* Mobile Socials */}
                  <div className="flex gap-4 mt-6">
                    <a
                      href="https://web.facebook.com/lyhoeng.hean"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity duration-300 hover:opacity-70"
                      style={{ color: textColor }}
                    >
                      <SocialIcon path={facebookPath} />
                    </a>
                    <a
                      href="https://t.me/Hean_Lyhoeng"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity duration-300 hover:opacity-70"
                      style={{ color: textColor }}
                    >
                      <SocialIcon path={telegramPath} />
                    </a>
                    <a
                      href="https://www.youtube.com/@T3MovieUniverse"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity duration-300 hover:opacity-70"
                      style={{ color: textColor }}
                    >
                      <SocialIcon path={youtubePath} />
                    </a>
                    <a
                      href="https://github.com/HeanLyhoeng?tab=repositories"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity duration-300 hover:opacity-70"
                      style={{ color: textColor }}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </div>
                </motion.div>

                {/* Mobile Contact Button */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6"
                >
                  <button
                    onClick={handleContactClick}
                    className="w-full min-h-[48px] px-5 py-4 rounded-full text-sm md:text-base font-medium transition-opacity duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 1)',
                      color: 'rgba(0, 0, 0, 1)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    Contact Me
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
