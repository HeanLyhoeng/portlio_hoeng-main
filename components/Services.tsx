import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { Footer } from './Footer';


export const Services: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Liu",
      role: "Co-Founder, ParallelML",
      quote: "Their design-thinking mindset combined with AI knowledge helped us go from prototype to production fast.",
      rating: 0,
      stat: "3× Faster MVP Launch"
    },
    {
      name: "Daniel Shore",
      role: "VP of Product, Synthara",
      quote: "They worked like an internal team — fast, flexible, and always clear.",
      rating: 0,
      stat: "70% Fewer Drop-Offs"
    },
    {
      name: "Jonas Berg",
      role: "Founder, FrameOps",
      quote: "We went from zero to launch in 6 weeks with rock-solid infra and refined UX.",
      rating: 0,
      stat: "99.8% / <500ms Product Launch at Scale"
    },
    {
      name: "Helena Brooks",
      role: "Head of Growth, Lineflow",
      quote: "Simple, thoughtful onboarding changes doubled activation — and it only took weeks.",
      rating: 0,
      stat: "+125% Activation Rate"
    },
    {
      name: "Maya El-Khoury",
      role: "CEO, Hexabase",
      quote: "A complete redesign that made our product investor-ready — sharp, intuitive, and conversion-focused.",
      rating: 0,
      stat: "4× Higher Investor Engagement"
    }
  ];

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Services Data - Edit category titles and sub-services here
  const services = [
    {
      title: "UI/UX Design",
      items: ["User Research", "Wireframing & Prototyping", "Design Systems", "Usability Testing", "Interaction Design"],
    },
    {
      title: "Graphic Design Strategy",
      items: ["Visual Trend Analysis", "Competitor Visual Audit", "Visual Hierarchy Prioritization", "Iconography & Illustration", "Brand Launch Kit Development"],
    },
    {
      title: "Video Strategy & Production",
      items: ["Intro/Outro Animation", "Video Style Guide", "Color Grading & VFX", "Content Format Strategy", "Thumbnail Templates"],
    },
    {
      title: "Software Licensing & Digital Solutions (T3 Software)",
      items: ["Authentic License Procurement (Adobe Creative Cloud, Microsoft 365)", "Generative AI Tools Access (Firefly)", "Cloud Storage Configuration", "24/7 Technical Support with Warranty"],
    },
  ];

  const industries = [
    {
      name: "AI & Machine Learning",
      description: "Designing Infographics and Explainer Videos to clearly simplify complex AI concepts, making advanced technology accessible."
    },

    {
      name: "Healthcare",
      description: "Healthcare products that prioritize user safety, accessibility, and ease of use while maintaining regulatory compliance."
    },
    {
      name: "E-Commerce",
      description: "Producing Compelling Product Videos, Digital Ads, and Promotional Graphics that drive sales conversion"
    },
    {
      name: "SaaS",
      description: "Designing Branded Templates for social media and producing Product Demo Videos to showcase software features"
    }
  ];

  const processSteps = [
    {
      phase: "Strategy",
      steps: ["Discovery", "Market Analysis", "Strategic Planning", "Roadmap Development", "Goal Setting"]
    },
    {
      phase: "UX Design",
      steps: ["User Research", "Information Architecture", "Wireframes", "Interactive Prototyping", "Usability Testing"]
    },
    {
      phase: "UI & Visual Design",
      steps: ["Visual Branding", "Graphic Asset Creation", "Design System", "Responsive Design", "Motion & Animation"]
    },
    {
      phase: "Development & Delivery",
      steps: ["Dev Handoff", "Quality Assurance (QA)", "Deployment & Launch", "Performance Optimization", "Post-Launch Support"]
    }
  ];

  // Fetch pricing plans from Supabase


  const caseStudies = [
    {
      image: "./img/phanit.jpg",
      title: "Designing Complex AI Interfaces That Users Actually Understand",
      category: "Design",
      date: "July 24, 2025",
      description: "How we create clean, intuitive interfaces for complex AI products without losing functionality."
    },
    {
      image: "../../img/Lead UX Designer.jpg",
      title: "Micro-Interactions That Make Interfaces Feel Alive",
      category: "Design",
      date: "July 21, 2025",
      description: "Explore how subtle motion effects enhance usability and engagement across modern interfaces."
    },
    {
      image: "../../img/Brand Identity.jpg",
      title: "65% Conversion Boost: FramerFlow's Modular UI Win",
      category: "Web design & Dev",
      date: "July 16, 2025",
      description: "By implementing a modular web system and intuitive landing page, FramerFlow improved sales instantly."
    }

  ];



  // Remove icon placeholder logic entirely
  return (
    <div className="min-h-screen bg-black text-slate-200">
      <style>{`
        /* Services animated header: minimal per-char scroll-triggered animation */
        .services-section { position: relative; }
        .services-animated-header { display:flex; align-items:center; justify-content:center; }
        .services-title { text-transform:uppercase; display:inline-flex; gap:4px; }
        .services-title .char { display:inline-block; font-family: Montserrat, sans-serif; font-weight:700; color:#fff; font-size: clamp(24px, 4vw, 32px); transform-origin:center; transition: transform 600ms cubic-bezier(0.19,1,0.22,1), opacity 400ms ease, letter-spacing 600ms ease; opacity:0.7; }
        .services-title .char.space { width:0.5rem; }
        /* active state triggered by IntersectionObserver when section scrolls into view */
        .services-section.active .services-title .char { opacity:0.95; transform: translateY(-4px) scale(1.02); letter-spacing: 1px; }
        /* staggered delay for nicer effect */
        .services-title .char:nth-child(1) { transition-delay: 0ms; }
        .services-title .char:nth-child(2) { transition-delay: 30ms; }
        .services-title .char:nth-child(3) { transition-delay: 60ms; }
        .services-title .char:nth-child(4) { transition-delay: 90ms; }
        .services-title .char:nth-child(5) { transition-delay: 120ms; }
        .services-title .char:nth-child(6) { transition-delay: 150ms; }
        .services-title .char:nth-child(7) { transition-delay: 180ms; }
        .services-title .char:nth-child(8) { transition-delay: 210ms; }
        .services-title .char:nth-child(9) { transition-delay: 240ms; }
        .services-title .char:nth-child(10) { transition-delay: 270ms; }
        .services-title .char:nth-child(11) { transition-delay: 300ms; }
        .services-title .char:nth-child(12) { transition-delay: 330ms; }
        .services-title .char:nth-child(13) { transition-delay: 360ms; }
        .services-title .char:nth-child(14) { transition-delay: 390ms; }
        @media (max-width:640px) {
          .services-title .char { font-size: clamp(20px, 8vw, 28px); }
        }
      `}</style>
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black pointer-events-none z-0" />
        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-gradient transition-colors mb-8 group"
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tighter break-words hyphens-auto">
              A design-driven AI & product partner
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed">
              We help startups and tech companies build exceptional digital products through design, development, and AI integration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Offerings - Premium Minimalist Design */}
      <section className="py-12 sm:py-16 md:py-20 bg-black services-section" id="our-services">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="services-animated-header mb-8 sm:mb-12">
            <div className="services-title" aria-hidden="false">
              {/* Minimal "OUR SERVICES" title */}
              {Array.from('OUR SERVICES').map((ch, i) => (
                <span key={i} className={ch === ' ' ? 'char space' : 'char'}>{ch}</span>
              ))}
            </div>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto"
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
            {services.map((service, i) => (
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
                {/* Category Heading - Apple Typography: tracking-tighter */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6 tracking-tight break-words">
                  {service.title}
                </h3>

                {/* Sub-services List - Apple Typography: text-white/70, leading-relaxed */}
                <div className="space-y-4">
                  {service.items.map((item, j) => (
                    <p key={j} className="text-sm sm:text-base text-white/70 leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* IntersectionObserver to trigger header animation when Services section scrolls into view */}
      {/* placed after the markup so DOM nodes exist */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function(){
            try {
              var section = document.getElementById('our-services');
              if(!section) return;
              var obs = new IntersectionObserver(function(entries){
                entries.forEach(function(e){
                  if(e.isIntersecting) section.classList.add('active'); else section.classList.remove('active');
                });
              }, { threshold: 0.45 });
              obs.observe(section);
            } catch(err) { console.error(err); }
          })();
        `}} />

      {/* Industries - Updated UI */}
      <section className="py-12 sm:py-16 md:py-20 bg-transparent">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-8 md:mb-12 text-center tracking-tighter break-words">
            Industries We Serve
          </h2>
          <div className="max-w-4xl mx-auto divide-y divide-white/10">
            {industries.map((industry, i) => (
              <div key={i} className="flex items-start py-8">
                {/* Remove icon placeholder */}
                <div className="hidden" />
                <div>
                  {/* Apple Typography: tracking-tight for h3 */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 tracking-tight break-words">{industry.name}</h3>
                  <p className="text-sm md:text-base text-white/70 leading-relaxed">{industry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white text-center mb-8 sm:mb-12 tracking-tighter break-words">
            We simplify product Design process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {processSteps.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="process-card-item bg-black border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 break-words">{phase.phase}</h3>
                <ul className="space-y-2">
                  {phase.steps.map((step, j) => (
                    <li key={j} className="text-white text-sm md:text-base flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-gradient" />
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white text-center mb-4 tracking-tighter break-words">
            Trusted by forward-thinking teams
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-white/70 text-center mb-8 sm:mb-12 leading-relaxed">
            Empowering fast-growing companies with design-driven, AI-powered solutions built for scale.
          </p>
          {/* Frame removed per request — only heading + paragraph are shown here */}
        </div>
      </section>



      {/* Final CTA Section */}
      <div className="w-full mt-16 md:mt-24 px-4 md:px-8 lg:px-16 pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto relative rounded-2xl md:rounded-[32px] overflow-hidden bg-white/5 border border-white/10 p-6 md:p-12 lg:p-20 text-center group">

          {/* Background Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter mb-4 md:mb-6 break-words hyphens-auto">
              Get started with us. <br className="hidden md:block" />
              <span className="text-gray-500">Have a vision? Let's build it.</span>
            </h2>

            <p className="text-sm md:text-base lg:text-xl text-gray-400 mb-8 md:mb-10">
              Ready to transform your product? Let's work together to build something extraordinary.
            </p>

            <button
              onClick={() => window.location.hash = '#contact'}
              className="w-full sm:w-auto min-h-[48px] bg-white text-black font-bold text-base md:text-lg px-8 md:px-10 py-3 md:py-4 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mx-auto hover:gap-4 hover:scale-105 shadow-lg"
            >
              Get Started
              {/* Arrow Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

