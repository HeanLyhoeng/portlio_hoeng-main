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
    <section className="relative w-full h-screen overflow-hidden bg-black flex items-center">

      {/* LAYER 0: Background Image (Atmosphere) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://jqszlmcwearhovsjknat.supabase.co/storage/v1/object/public/avatars/freepik__a-highangle-shot-captures-a-young-man-with-tousled__61066.jpeg"
          alt="Atmosphere"
          className="w-full h-full object-cover blur-sm opacity-50"
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">

        {/* LAYER 1: Text Content (Left Side) */}
        <div className="max-w-3xl pt-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-3 py-1 mb-6 border border-[#103783]/30 rounded-full bg-[#103783]/10 backdrop-blur-md">
              <span className="text-white text-xs font-bold tracking-widest uppercase">Available for Freelance</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tighter">
              DESIGNING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">INTUITIVE</span> <br />
              <span className="relative inline-block">
                DIGITAL
                {/* Optional Glitch Effect or Glow */}
                <div className="absolute -inset-1 bg-[#103783]/40 blur-xl -z-10" />
              </span> <br />
              EXPERIENCES
            </h1>

            <p className="text-gray-400 text-lg max-w-xl mb-8 leading-relaxed">
              {displayContent.hero_description}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
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
                className="px-8 py-4 bg-[#103783] hover:bg-[#1545a1] text-white font-bold rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,55,131,0.5)]"
              >
                {displayContent.hero_button_text || 'Explore My Work'} <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href={resumeDownloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white font-bold rounded-full transition-all flex items-center gap-2"
              >
                Download Resume <Download className="w-5 h-5" />
              </a>
            </div>

            {/* Bottom Stats */}
            <div className="flex gap-8 md:gap-12 border-t border-white/10 pt-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-xs text-white font-mono mb-1 uppercase tracking-wider flex items-center gap-2">
                    {stat.icon} {stat.label}
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* LAYER 2: Foreground Cutout (Far Right) */}
      <div className="hidden lg:block absolute bottom-0 right-0 z-20 h-[90%] w-auto pointer-events-none">
        {/* REPLACE THIS SRC WITH YOUR TRANSPARENT PNG */}
        <img
          src=""
          alt="Portrait"
          className="h-auto max-h-[80vh] w-auto object-contain object-bottom drop-shadow-2xl"
          // Note: In real production, this needs to be a transparent PNG.
          style={{
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
          }}
        />
      </div>

    </section>
  );
};