import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { NeonButton } from './ui/NeonButton';

interface DesignDetailProps {
  categoryTitle: string;
  onBack: () => void;
}

// ⚠️ ចំណាំ: categoryData នេះត្រូវតែ Import ពីខាងក្រៅ (ឧទាហរណ៍: import { categoryData } from '../data/categoryData';)
// ខ្ញុំបានដាក់ Placeholder ខាងក្រោមនេះ ដើម្បីកុំអោយមាន Error, តែបងត្រូវជំនួសដោយទិន្នន័យពិតប្រាកដ ឬការ Import.
const categoryData: Record<string, any> = {};


export const DesignDetail: React.FC<DesignDetailProps> = ({ categoryTitle, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const data = categoryData[categoryTitle.toLowerCase().replace(/\s+/g, '-')] || {
    title: categoryTitle,
    description: 'Detailed information about this design category will be added soon.',
    heroImage: './img/.jpg',
    projects: []
  };

  return (
    <section className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-24 container mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-gradient transition-colors mb-6 sm:mb-8 group"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs sm:text-sm">Back to Portfolio</span>
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Category Hero Image */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-6 sm:mb-8">
            <img
              src={data.heroImage}
              alt={`${data.title} category image`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {data.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mb-8 sm:mb-12 leading-relaxed">
            {data.description}
          </p>

          <div className="bg-dark-card border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Projects in this Category</h2>

            {data.projects.length > 0 ? (
              <div className="space-y-4">
                {data.projects.map((project: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/5 hover:border-neon-primary/30 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-2 sm:mb-1 text-sm sm:text-base">{project.name}</h3>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                          {project.year || project.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag size={12} className="sm:w-3.5 sm:h-3.5" />
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">
                Project details will be added by the client soon.
              </p>
            )}
          </div>

          <div className="text-center">
            <NeonButton variant="primary" onClick={onBack} className="w-full sm:w-auto">
              Return to Portfolio
            </NeonButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
};