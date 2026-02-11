import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { AboutThumnails } from './AboutThumnails';
import { Footer } from './Footer';

export const AboutUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {

  // Client testimonial images
  // Change this URL to your desired remote image for client #20
  const specialImage20Url = 'https://picsum.photos/1920/1080?random=20';
  const images = [
    { id: 1, src: '../img/Music/1.jpg', alt: 'Music HipHop Thumnail' },
    { id: 2, src: '../img/Music/2.jpg', alt: 'Music HipHop Thumnail' },
    { id: 3, src: '../img/Music/3.jpg', alt: 'Music BlueThumnail' },
    { id: 4, src: 'https://images.hdqwalls.com/wallpapers/bthumb/monster-hunter-2020-70.jpg', alt: 'Client testimonial 4' },
    { id: 5, src: 'https://images.hdqwalls.com/wallpapers/bthumb/tony-jaa-monster-hunter-2020-zq.jpg', alt: 'Client testimonial 5' },
    { id: 6, src: 'https://images.hdqwalls.com/wallpapers/bthumb/death-on-the-nile-15k-2q.jpg', alt: 'Client testimonial 6' },
    { id: 7, src: 'https://images.hdqwalls.com/wallpapers/bthumb/death-on-the-nile-15k-2q.jpg', alt: 'Client testimonial 7' },
    { id: 8, src: 'https://images.hdqwalls.com/wallpapers/bthumb/2020-death-on-the-nile-emma-mackey-c8.jpg', alt: 'Client testimonial 8' },
    { id: 9, src: 'https://images.hdqwalls.com/wallpapers/bthumb/2020-death-on-the-nile-emma-mackey-c8.jpg', alt: 'Client testimonial 9' },
    { id: 10, src: 'https://images.hdqwalls.com/wallpapers/bthumb/obi-wan-kenobi-4k-artwork-lt.jpg', alt: 'Special Client 10' },

    // Target this one (editable URL above)
  ];

  // Team Members Data - Edit names, roles, and image paths here
  const teamMembers = [
    { name: "Hean Lyhoeng", role: "Graphic & Video , Digital Marking , Web Designer", image: '/img/team/hoeng.jpg' },
    { name: "Seam Oudom", role: "Creative Director Graphic Designer , Flim/MotionVideo Editor.", image: '/img/team/oudom.jpg' },
    { name: "Moun Taipon", role: "BackEnd Developer", image: '/img/team/taipon.jpg' },
  ];

  // Outcomes and Results Data - Edit project names, metrics, logos, and descriptions here
  const outcomes = [
    {
      name: "Zerra",
      subtitle: "E-commerce Platform",
      metric: "+200% Conversion Rate",
      logo: '',
      description: "Web Development (Optimized E-commerce Flow), Graphic Design (Campaign Ads), Video Editor (Product Videos)",
      image: '/img/Header/H.jpg',
    },
    {
      name: "Boltframe",
      subtitle: "SaaS Application",
      metric: "50K+ Active Users",
      logo: '',
      description: "UI/UX Design, Graphic Design (Brand Guidelines), Video Editor (Onboarding Tutorials)",
      image: '',
    },
    {
      name: "BEdgebeam",
      subtitle: "FinTech Startup",
      metric: "$2M Investment Secured",
      logo: '',
      description: "Graphic Design (Rebranding), Web Development (Security Feature), Video Editor (Explainer Content)",
      image: '',
    }
  ];

  // Resolve image source: allow remote URLs (http/https), absolute paths (/) and relative paths
  // Example supported relative path: "../img/ABC/123.jpg"
  const resolveSrc = (src: string) => {
    if (!src) return src;
    // remote URL or absolute path already OK
    if (/^https?:\/\//i.test(src) || src.startsWith('/')) return src;
    try {
      // Vite-friendly resolution: create a URL relative to this module
      return new URL(src, import.meta.url).href;
    } catch (err) {
      return src;
    }
  };

  // Data for other sections

  const awards = [
    { name: "Best UI/UX Design", category: "Design Excellence", year: "2024" },
    { name: "Innovation Award", category: "Technology", year: "2023" },
    { name: "Product of the Year", category: "SaaS", year: "2023" }
  ];

  // Helper function to render a single carousel item
  const renderCarouselItem = (image: typeof images[0], keyPrefix: string) => {
    // ----------------------------------------------------------------
    // SPECIAL ANIMATION LOGIC FOR ID 20 (Based on Concept Seven/Jump-Out)
    // ----------------------------------------------------------------
    if (image.id === 20) {
      return (
        <div key={`${keyPrefix}-${image.id}`} className="about-image-carousel-item carousel-special">
          <div className="wrapper">
            <div className="image-wrapper">
              <img
                src={resolveSrc(image.src)}
                alt={image.alt}
                className="about-image-carousel-img special-img"
                loading="eager"
                decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/1583/300?random=${image.id}`; }}
              />
            </div>
            <div className="header-wrapper">
              <h1 className="title-main">CLIENT 20</h1>
              <h1 className="title-sub">See Project</h1>
            </div>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------------------
    // STANDARD RENDER FOR ALL OTHER IMAGES
    // ----------------------------------------------------------------
    return (
      <div key={`${keyPrefix}-${image.id}`} className="about-image-carousel-item">
        <img
          src={resolveSrc(image.src)}
          alt={image.alt}
          className="about-image-carousel-img"
          loading="eager"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/1920/1080?random=fallback${image.id}`;
          }}
        />
      </div>
    );
  };

  // IntersectionObserver to toggle `.active` on each concept section when in view
  useEffect(() => {
    const container = document.querySelector('.clients-visuals');
    if (!container) return;
    const sections = Array.from(container.querySelectorAll('.concept')) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.classList.add('active');
          else el.classList.remove('active');
        });
      },
      { root: container as Element, threshold: 0.55 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-200">

      {/* Injecting the specific Jump-Out Keyframes and styles (adapted) */}
      <style>{`
        @keyframes jump-out {
          0% {
            opacity: 0;
            transform: scale(1);
          }
          20% {
            opacity: 0.9;
            transform: scale(1.05) translateY(-10px);
          }
          100% {
            opacity: 0;
            transform: scale(1.5) translateY(-60px);
          }
        }

        .animate-jump-out {
          animation: jump-out 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Pause marquee on hover so user can see the effect */
        .about-image-carousel-slider:hover {
            animation-play-state: paused;
        }

        /* Concept-seven inspired styles for the special item (image id 20) */
        .concept-seven-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #000; /* fallback */
        }

        .concept-seven-wrapper .about-image-carousel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: saturate(0.85) contrast(1.05);
        }

        /* Overlay title that uses the pseudo-element jump-out behavior from the source code */
        .concept-seven-title {
          position: absolute;
          z-index: 40;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-family: Montserrat, sans-serif;
          font-weight: 900;
          font-size: 44px;
          letter-spacing: 30px;
          color: transparent;
          -webkit-text-stroke: 0px transparent;
          pointer-events: none;
          transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .concept-seven-title:before {
          content: attr(data-text);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: transparent;
          text-shadow: none;
          transition: color 0.25s ease, transform 0.6s ease;
          z-index: 41;
        }

        /* On hover show the overlay text and trigger the jump-out ghost animation */
        .about-image-carousel-item.group:hover .concept-seven-title:before {
          color: rgba(255,255,255,0.95);
          animation: jump-out 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Make sure the ghost image sits above the base image while animating */
        .about-image-carousel-item.group .group-hover\:animate-jump-out {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 39;
        }

        /* Slight visual polish: fade base image when hovering to emphasize jump */
        .about-image-carousel-item.group:hover .about-image-carousel-img {
          filter: blur(1px) brightness(0.8) saturate(0.9);
          transform: scale(1.02);
          transition: transform 0.4s ease, filter 0.4s ease;
        }

        /* --------------------------------------------------
           Special wrapper animation (based on your example)
           - scoped under .carousel-special to avoid global clash
           -------------------------------------------------- */
        .carousel-special .wrapper {
          position: relative;
          height: 260px; /* reasonable carousel-friendly height */
          width: 100%;
          display: flex;
          align-items: center;
          transition: all 220ms ease-in-out;
          overflow: visible;
        }

        .carousel-special .image-wrapper {
          height: 100%;
          width: 70%;
          overflow: hidden;
          border-radius: 8px;
          transition: all 220ms ease-in-out;
        }

        .carousel-special .special-img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 200ms ease-in-out;
          will-change: transform;
        }

        .carousel-special .header-wrapper {
          display: flex;
          flex-direction: column;
          position: absolute;
          height: 100%;
          width: 45%;
          left: 58%;
          padding-left: 20px;
          transition: all 220ms ease-in-out;
          pointer-events: none;
        }

        .carousel-special .title-main,
        .carousel-special .title-sub {
          margin: 0;
          height: 50%;
          color: #fff;
          font-size: 36px;
          font-family: Oswald, Montserrat, sans-serif;
          text-transform: uppercase;
          line-height: 1;
          transition: all 220ms ease-in-out;
          transform-origin: left center;
        }

        .carousel-special .title-main { font-weight: 700; font-size: 40px; }
        .carousel-special .title-sub { font-weight: 400; font-size: 20px; opacity: 0.9; }

        /* Hover interactions: scale image, slide header text upward and shrink */
        .carousel-special .wrapper:hover .special-img {
          transform: scale(1.95);
        }

        .carousel-special .wrapper:hover .image-wrapper {
          width: 120%;
        }

        .carousel-special .wrapper:hover .title-main,
        .carousel-special .wrapper:hover .title-sub {
          transform: translateY(-120% ) scale(0.48);
        }

        /* keep marquee paused so hover animation is visible */
        .carousel-special:hover ~ .about-image-carousel-slider,
        .carousel-special:hover .about-image-carousel-slider {
          animation-play-state: paused;
        }

        /* ==================================================
           DISABLE ALL ANIMATIONS/TRANSITIONS INSIDE
           THE "What Our Clients" CAROUSEL SECTION
           Scoped to avoid affecting other pages
           ================================================== */
        .about-image-carousel-wrapper,
        .about-image-carousel-wrapper * {
          animation: none !important;
          transition: none !important;
          will-change: auto !important;
        }

        /* ensure images don't transform or scale */
        .about-image-carousel-item,
        .about-image-carousel-img,
        .carousel-special .special-img,
        .carousel-special .image-wrapper,
        .carousel-special .wrapper,
        .carousel-special .title-main,
        .carousel-special .title-sub {
          transform: none !important;
        }

        /* restore natural layout for the special header wrapper */
        .carousel-special .header-wrapper {
          position: relative !important;
          left: auto !important;
          width: auto !important;
          padding-left: 0 !important;
          pointer-events: auto !important;
        }

        /* keep carousel visible and static (no marquee movement) */
        .about-image-carousel-slider {
          animation: none !important;
        }

        /* ---------- Convert marquee to user-scrollable row ---------- */
        .about-image-carousel-cover {
          position: relative;
          width: 100%;
          height: auto;
          background: transparent;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          z-index: 1;
          padding: 12px 0;
        }

        .about-image-carousel-slider {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 220px;
          width: auto;
          gap: 12px;
          padding: 8px 12px;
          will-change: auto;
          z-index: 2;
          background: transparent;
          animation: none !important;
        }

        .about-image-carousel-item {
          position: relative;
          min-width: 180px;
          height: 180px;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
        }

        .about-image-carousel-img {
          position: relative;
          width: 100%;
          height: 100%;
          min-width: 0;
          max-width: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          border-radius: 8px;
        }

        /* ---------- Vertical scrollable client visuals (per-section animations) ---------- */
        .clients-visuals {
          height: calc(100vh - 160px);
          max-height: calc(100vh - 160px);
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          -webkit-overflow-scrolling: touch;
          margin-top: 18px;
          border-radius: 12px;
        }

        .clients-visuals .concept {
          height: calc(100vh - 160px);
          scroll-snap-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }

        .clients-visuals .concept:before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.45));
          transition: opacity 0.6s ease;
          opacity: 0.25;
        }

        .clients-visuals .concept.active:before { opacity: 0.6; }

        .concept-inner { position: relative; z-index: 5; width: 100%; display:flex; align-items:center; justify-content:center; }

        .visual-content { text-align: center; pointer-events: none; }

        .visual-content .title {
          color: #fff;
          font-family: Montserrat, sans-serif;
          font-weight: 900;
          font-size: clamp(28px, 6vw, 64px);
          letter-spacing: 10px;
          margin: 0;
          transform-origin: center;
          transition: transform 0.8s cubic-bezier(0.19,1,0.22,1), opacity 0.6s ease, letter-spacing 0.6s ease;
          opacity: 0.9;
          text-transform: uppercase;
        }

        /* when a section becomes active (scrolled into view) apply stronger effect */
        .clients-visuals .concept.active .title {
          transform: translateY(-12px) scale(1.06);
          letter-spacing: 18px;
          opacity: 1;
        }

        /* a few per-concept flavor tweaks (cycle 1..8)
           these use .active instead of :hover so scroll triggers work */
        .concept-1 .title { letter-spacing: 20px; }
        .concept-2 .title { -webkit-text-stroke: 2px rgba(255,255,255,0.9); color: transparent; }
        .concept-2.active .title { color: #fff; -webkit-text-stroke: 0px transparent; transform: scale(1.15); }
        .concept-3 .title { transform-origin: center; }
        .concept-3.active .title { transform: translateY(-18px) scale(1.04); }
        .concept-4.active .title { transform: scale(1.2); letter-spacing: 30px; }
        .concept-5.active .title { transform: translateY(-22px) rotate(-1deg); }
        .concept-6.active .title { transform: translateY(-10px) rotate(2deg) scale(1.05); }
        .concept-7 .title:before { content: attr(data-before); display:block; color: transparent; }
        .concept-7.active .title:before { color: rgba(255,255,255,0.95); animation: jump-out 0.9s ease forwards; }
        .concept-8.active .title { letter-spacing: 14px; transform: translateY(-10px) scale(1.03); }

        @media (max-width: 768px) {
          .clients-visuals { height: calc(100vh - 120px); max-height: calc(100vh - 120px); }
          .clients-visuals .concept { height: calc(100vh - 120px); }
          .visual-content .title { font-size: clamp(20px, 8vw, 44px); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black pointer-events-none z-0" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-neon-primary transition-colors mb-8 group"
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
              {/* heading text retained, hero frame removed */}
              Design studio for AI, SaaS & tech startups
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              We're a product design & AI studio that helps startups and tech companies build exceptional digital products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Executive Team - Premium Minimalist Design */}
      <section className="py-12 sm:py-16 md:py-20 bg-black about-outcomes-wrapper">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
            Executive Team
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 40,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  },
                }}
              >
                {/* Raw Image - No Frames, Borders, or Shadows */}
                {member.image ? (
                  <img
                    src={resolveSrc(member.image)}
                    alt={member.name}
                    className="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/avatar/400/600'; }}
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                    <span className="text-sm text-white/60 font-mono">Profile Photo</span>
                  </div>
                )}

                {/* Name & Role - Directly Below Image */}
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-lg sm:text-xl text-white mb-1 uppercase tracking-wide">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Awards & Achievements */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
            Awards & Achievements
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="about-awards-container bg-black border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-mono text-slate-400 uppercase">Award</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-mono text-slate-400 uppercase">Category</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-mono text-slate-400 uppercase">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awards.map((award, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="about-awards-row border-t border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-white font-medium">{award.name}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-400">{award.category}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-400">{award.year}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes and Results - Premium Minimalist Design */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
            Outcomes and Results
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {outcomes.map((outcome, i) => (
              <motion.div
                key={i}
                className="flex flex-col"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 40,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  },
                }}
              >
                {/* Logo */}
                {outcome.logo && (
                  <div className="mb-4">
                    <img
                      src={resolveSrc(outcome.logo)}
                      alt={`${outcome.name} logo`}
                      className="h-16 w-auto object-contain"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${outcome.name}-z/120/120`; }}
                    />
                  </div>
                )}

                {/* Project Name */}
                <h3 className="font-bold text-xl sm:text-2xl text-white mb-1">
                  {outcome.name}
                </h3>
                {outcome.subtitle && (
                  <p className="text-sm text-slate-400 mb-4">
                    {outcome.subtitle}
                  </p>
                )}

                {/* Result Metric - High Contrast */}
                <p className="text-3xl sm:text-4xl font-black text-neon-primary mb-4">
                  {outcome.metric}
                </p>

                {/* Description - Clean Typography */}
                <p className="text-sm text-slate-400 leading-relaxed">
                  {outcome.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Thumbnail - Horizontal Infinite Auto-Scrolling Marquee */}
      {/* Component fetches images from Supabase storage: projects/about-thumbnails/ */}
      <AboutThumnails />

      <Footer />
    </div>
  );
};