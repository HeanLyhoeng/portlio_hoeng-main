import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
  isNew?: boolean;
  isFeatured?: boolean;
  videoUrl?: string;
}

interface StreamingProjectCardProps {
  project: ProjectData;
  onClick?: () => void;
  isLandscape?: boolean;
  variableWidth?: boolean;
}


export const StreamingProjectCard: React.FC<StreamingProjectCardProps> = ({ project, onClick, isLandscape = false, variableWidth = false }) => {

  return (
    <motion.div
      className={`relative flex-shrink-0 cursor-pointer group ${variableWidth
        ? 'h-full w-fit'
        : isLandscape ? 'w-[280px] md:w-[340px]' : 'w-[200px] md:w-[240px]'
        }`}


      whileHover={{
        scale: 1.05,
        zIndex: 10,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
    >
      {/* Poster Image Container */}
      <div className={`relative rounded-md overflow-hidden bg-gray-800 shadow-lg ${variableWidth
        ? 'h-full w-fit'
        : isLandscape ? 'aspect-video' : 'aspect-[2/3]'
        }`}>


        <img
          src={project.image}
          alt={project.title}
          className={`h-full object-contain transition-opacity duration-300 group-hover:opacity-60 pointer-events-none ${variableWidth ? 'w-auto max-w-none' : 'w-full object-cover'}`}


          loading="lazy"
        />


        {/* Dark Gradient Overlay (Bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {project.isFeatured && (
            <span className="px-2 py-0.5 bg-green-500 text-black text-[10px] uppercase font-bold rounded-sm tracking-wide">
              Featured
            </span>
          )}
          {project.isNew && (
            <span className="px-2 py-0.5 bg-[#FFD700] text-black text-[10px] uppercase font-bold rounded-sm tracking-wide">
              New
            </span>
          )}
        </div>

        {/* Hover Overlay with Play Icon - ONLY if videoUrl exists */}
        {project.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
              <Play fill="white" className="text-white ml-1 w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Metadata (Below Card) */}
      <div className="mt-3 px-1">
        <h3 className="text-white text-sm font-semibold truncate group-hover:text-[#FFD700] transition-colors">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
};
