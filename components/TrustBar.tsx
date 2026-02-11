import React from 'react';
import { motion } from 'framer-motion';

export const TrustBar: React.FC = () => {
  const brands = [
    "GOOGLE", "SPOTIFY", "AIRBNB", "STRIPE", "NETFLIX", "ADOBE", "FIGMA", "WEBFLOW"
  ];

  return (
    <section className="py-10 border-y border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="flex relative">
        <motion.div
          className="flex gap-16 md:gap-24 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20
          }}
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-pointer">
              <span className="text-xl md:text-2xl font-bold text-slate-600 group-hover:text-blue-gradient transition-colors font-mono">
                {brand}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};