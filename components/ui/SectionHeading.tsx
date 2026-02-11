import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  subtitleColor?: 'neon' | 'white';
  titleColor?: 'gold' | 'white';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, alignment = 'left', subtitleColor = 'neon', titleColor = 'gold' }) => {
  return (
    <div className={`mb-12 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`block font-mono text-sm tracking-[0.2em] uppercase mb-2 ${subtitleColor === 'white' ? 'text-white' : 'text-blue-gradient'}`}
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-3xl md:text-4xl lg:text-5xl font-bold ${titleColor === 'white' ? 'text-white' : 'text-blue-gradient'}`}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: alignment === 'center' ? 60 : 80 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className={`h-1 bg-blue-gradient mt-4 ${alignment === 'center' ? 'mx-auto' : ''}`}
      />
    </div>
  );
};