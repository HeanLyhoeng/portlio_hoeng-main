import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface HeroSliderItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image_url: string | null;
    video_url: string | null;
    display_order: number;
}

interface StreamingHeroProps {
    heroItems: HeroSliderItem[];
    minimal?: boolean;
    className?: string; // Allow custom classes (e.g., for height)
}

export const StreamingHero: React.FC<StreamingHeroProps> = ({ heroItems, minimal, className }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-rotate hero every 4 seconds with infinite loop
    useEffect(() => {
        const startTimer = () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            timerRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % heroItems.length);
            }, 4000);
        };

        if (heroItems.length > 0) {
            startTimer();
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [heroItems.length]);

    // Reset timer when manual control is used
    const handleManualControl = (newIndex: number) => {
        setCurrentIndex(newIndex);
        // Reset timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroItems.length);
        }, 4000);
    };

    if (!heroItems || heroItems.length === 0) return null;

    const currentItem = heroItems[currentIndex];
    const isVideoProject =
        currentItem.category?.toUpperCase() === 'VIDEO EDITING' ||
        currentItem.video_url !== null;

    return (
        <div className={`relative w-full overflow-hidden text-white group ${className || 'h-[70vh] md:h-[85vh]'}`}>
            <AnimatePresence mode='popLayout'>
                <motion.div
                    key={currentItem.id}
                    initial={{ x: "100%", opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-20%", opacity: 0 }}
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30, duration: 0.8 },
                        opacity: { duration: 0.5 }
                    }}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    {/* Background - Video or Image */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        {isVideoProject && currentItem.video_url ? (
                            // CASE A: Video Project
                            <video
                                src={currentItem.video_url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            // CASE B: Image Project
                            <img
                                src={currentItem.image_url || 'https://placehold.co/1920x1080/1a1a1a/white?text=No+Image'}
                                alt={currentItem.title}
                                className="w-full h-full object-cover object-center"
                            />
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    {!minimal && (
                        <div className="absolute top-[30%] md:top-[35%] left-4 md:left-12 max-w-2xl px-4 z-10">
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                {/* Category Badge - Dynamic */}
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-black bg-[#FFD700] rounded-sm uppercase">
                                    {currentItem.category || 'PROJECT'}
                                </span>

                                {/* Title - Dynamic */}
                                <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-xl leading-tight">
                                    {currentItem.title}
                                </h1>

                                {/* Description - Dynamic */}
                                <p className="text-gray-200 text-sm md:text-lg mb-6 max-w-lg line-clamp-3 drop-shadow-md">
                                    {currentItem.description || 'An immersive project showcasing high-end techniques. Experience the visual journey and technical precision behind this featured work.'}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 relative z-[9999]">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            console.log("Force navigating to /all-works");
                                            navigate('/all-works');
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-colors text-sm md:text-base cursor-pointer relative z-[9999] pointer-events-auto"
                                    >
                                        <Play className="w-5 h-5 fill-black" />
                                        View Project
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 right-8 md:right-12 flex gap-2 z-20">
                {heroItems.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleManualControl(idx)}
                        className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'bg-[#FFD700] w-8' : 'bg-gray-500/50 w-4 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
