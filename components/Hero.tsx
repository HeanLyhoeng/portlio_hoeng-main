import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Layers, Zap, Star, Loader2, Play, Triangle, Circle, Square } from 'lucide-react';
import { fetchHeroContent, HeroContent } from '../Nuel-folio ux_ui-portfolio/src/services/heroService';

type ActiveMenu = 'home' | 'services' | 'about' | 'work';

interface HeroProps {
  activeMenu?: ActiveMenu;
}

export const Hero: React.FC<HeroProps> = ({ activeMenu = 'home' }) => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback content if Supabase is not configured or fails
  const fallbackContent: HeroContent = {
    id: 'fallback',
    hero_title: 'DESIGNING INTUITIVE DIGITAL EXPERIENCES',
    hero_description: 'Creative Graphic Designer & Video Editor with a passion for visual storytelling. I specialize in creating impactful static visuals and engaging video content.',
    hero_button_text: 'Explore My Work'
  };

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        setLoading(true);
        const content = await fetchHeroContent();
        setHeroContent(content || fallbackContent);
      } catch (error) {
        console.error('Error loading hero content:', error);
        setHeroContent(fallbackContent);
      } finally {
        setLoading(false);
      }
    };

    loadHeroContent();
  }, []);

  const displayContent = heroContent || fallbackContent;
  const stats = [
    { label: 'Experience', value: '1+ Years', icon: <Layers className="w-5 h-5 text-blue-500" /> },
    { label: 'Projects', value: '20+ Launched', icon: <Zap className="w-5 h-5 text-cyan-400" /> },
    { label: 'Client Rating', value: '3.9/5.0', icon: <Star className="w-5 h-5 text-yellow-400" /> },
  ];

  // Google Drive Link for Resume Download
  const resumeDownloadLink = "https://drive.google.com/file/d/1PmFjCSizkvZBQF2TblYMAId59vtElmBd/view?usp=sharing";

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col md:flex-row md:items-center">

      {/* LAYER 0: Background Image (Atmosphere) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://jqszlmcwearhovsjknat.supabase.co/storage/v1/object/public/avatars/freepik__a-highangle-shot-captures-a-young-man-with-tousled__61066.jpeg"
          alt="Atmosphere"
          className="w-full h-full object-cover blur-sm opacity-50"
          loading="eager"
          decoding="async"
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent md:bg-gradient-to-r md:from-black md:via-black/70 md:to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10 h-full flex flex-col md:flex-row md:items-center pt-24 md:pt-0 pb-24 md:pb-0">
        {/* LAYER 1: Text Content — Top on mobile, Left on desktop */}
        <div className="max-w-3xl w-full pt-6 md:pt-10 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-3 py-1 mb-4 md:mb-6 border border-[#103783]/30 rounded-full bg-[#103783]/10 backdrop-blur-md">
              <span className="text-white text-xs font-bold tracking-widest uppercase">Available for Freelance</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-[0.95] md:leading-[0.9] mb-4 md:mb-6 tracking-tighter break-words hyphens-auto">
              DESIGNING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">INTUITIVE</span> <br />
              <span className="relative inline-block">
                DIGITAL
                <div className="absolute -inset-1 bg-[#103783]/40 blur-xl -z-10" />
              </span> <br />
              EXPERIENCES
            </h1>

            <p className="text-gray-400 text-sm md:text-base max-w-xl mb-6 md:mb-8 leading-relaxed">
              {displayContent.hero_description}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
              <button
                onClick={() => {
                  const element = document.querySelector('#work');
                  if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#103783] hover:bg-[#1545a1] text-white text-sm md:text-base font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,55,131,0.5)]"
              >
                {displayContent.hero_button_text || 'Explore My Work'} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <a
                href={resumeDownloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-white/20 hover:bg-white/10 text-white text-sm md:text-base font-bold rounded-full transition-all flex items-center justify-center gap-2"
              >
                Download Resume <Download className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>

            {/* Bottom Stats */}
            <div className="flex flex-wrap gap-6 md:gap-8 lg:gap-12 border-t border-white/10 pt-4 md:pt-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-xs text-white font-mono mb-1 uppercase tracking-wider flex items-center gap-2">
                    {stat.icon} {stat.label}
                  </span>
                  <span className="text-lg md:text-2xl font-bold text-white font-mono">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* LAYER 2: Foreground Cutout — Mobile: Stacked; Tablet/Desktop: Absolute Right */}
        <div className="relative mt-8 md:mt-0 md:absolute md:bottom-0 md:right-0 z-20 pointer-events-none flex justify-center md:justify-end items-end h-full w-full md:w-auto">
          <img
            src="https://jqszlmcwearhovsjknat.supabase.co/storage/v1/object/public/avatars/4.png"
            alt="Portrait"
            className="w-full h-auto max-h-[60vh] md:h-[90vh] lg:h-[95vh] lg:w-auto object-contain object-bottom drop-shadow-2xl opacity-100"
            loading="lazy"
            decoding="async"
            style={{
              maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </section>
  );
};