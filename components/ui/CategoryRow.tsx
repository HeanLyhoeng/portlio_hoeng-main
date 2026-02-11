import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StreamingProjectCard, ProjectData } from './StreamingProjectCard';

interface CategoryRowProps {
    title: string;
    projects: ProjectData[];
    isLandscape?: boolean;
    onProjectClick?: (project: ProjectData) => void;
    rowIndex?: number;
    totalRows?: number;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ title, projects, isLandscape = false, onProjectClick, rowIndex = 0, totalRows = 1 }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [isMoved, setIsMoved] = useState(false);

    // Fixed height for the row when using variable width (original aspect ratio)
    const rowHeightClass = "h-[400px]";


    const handleClick = (direction: 'left' | 'right') => {
        setIsMoved(true);

        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth / 2
                : scrollLeft + clientWidth / 2;

            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const isLongContent = projects.length > 5;

    // JS Animation & Drag Refs (no state during drag to avoid re-render storms)
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const [isDown, setIsDown] = useState(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);
    const dragRafId = useRef<number | null>(null);
    const pendingScroll = useRef<number | null>(null);


    // Duplicate projects for seamless loop if content is long
    const displayProjects = isLongContent ? [...projects, ...projects] : projects;
    useEffect(() => {
        if (!isLongContent) return;

        let animationFrameId: number;

        const animate = () => {
            // 1. If dragging, just strictly update position from drag delta (handled in mousemove)
            //    But we need to ensure we don't 'drift' if we rely on requestAnimationFrame for inertia?
            //    For now, direct drag is handled in handleMouseMove. We just skip auto-scroll here.
            if (isDragging.current) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            // 2. Alternating Auto-Scroll Logic
            //    We base this on a global timer (Date.now()) so all rows are synchronized.
            const now = Date.now();
            const MOVE_DURATION = 1500; // 1.5 seconds of movement
            const TOTAL_CYCLE = MOVE_DURATION * totalRows;

            // Which "slot" of the cycle are we in?
            const timeInCycle = now % TOTAL_CYCLE;

            // formatting: rowIndex 0 moves [0..1500], rowIndex 1 moves [1500..3000], etc.
            const myStart = rowIndex * MOVE_DURATION;
            const myEnd = myStart + MOVE_DURATION;

            const shouldMove = timeInCycle >= myStart && timeInCycle < myEnd;

            if (shouldMove) {
                if (contentRef.current) {
                    contentRef.current.scrollLeft += 0.5; // Use scrollLeft instead of transform
                }
            }

            // 3. Infinite Loop Reset
            if (contentRef.current) {
                const fullWidth = contentRef.current.scrollWidth;
                const halfWidth = fullWidth / 2;

                // If we've scrolled past half the duplicated width, reset to 0
                if (contentRef.current.scrollLeft >= halfWidth) {
                    contentRef.current.scrollLeft -= halfWidth;
                } else if (contentRef.current.scrollLeft <= 0) {
                    contentRef.current.scrollLeft += halfWidth;
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isLongContent, totalRows, rowIndex]);

    // Drag Handlers
    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isLongContent) return;
        setIsDown(true);
        isDragging.current = false;
        startX.current = e.pageX - (contentRef.current?.offsetLeft || 0);
        if (contentRef.current) {
            startScrollLeft.current = contentRef.current.scrollLeft;
        }
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };


    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !isLongContent) return;
        e.preventDefault();

        const x = e.pageX - (contentRef.current?.offsetLeft || 0);
        const walk = (x - startX.current) * 2;
        if (Math.abs(walk) > 5) isDragging.current = true;

        // Throttle scroll updates via rAF (one DOM update per frame max)
        pendingScroll.current = startScrollLeft.current - walk;
        if (dragRafId.current !== null) return;
        dragRafId.current = requestAnimationFrame(() => {
            dragRafId.current = null;
            if (contentRef.current && pendingScroll.current !== null) {
                contentRef.current.scrollLeft = pendingScroll.current;
            }
        });
    };



    const handleMouseUp = () => {
        setIsDown(false);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
        if (dragRafId.current !== null) {
            cancelAnimationFrame(dragRafId.current);
            dragRafId.current = null;
        }
        pendingScroll.current = null;
        setTimeout(() => { isDragging.current = false; }, 50);
    };


    const handleMouseLeave = () => {
        setIsDown(false);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
        if (dragRafId.current !== null) {
            cancelAnimationFrame(dragRafId.current);
            dragRafId.current = null;
        }
        pendingScroll.current = null;
        isDragging.current = false;
    };



    return (
        <div className="flex flex-col space-y-2 py-8 relative overflow-hidden">
            {/* Category Title */}
            <div className="px-4 md:px-12 flex items-center gap-3 mb-4 group cursor-pointer z-10 relative">
                <div className="w-1 h-6 bg-[#FFD700] rounded-full" />
                <h2 className="text-white text-xl md:text-2xl font-bold group-hover:text-[#FFD700] transition-colors">
                    {title}
                </h2>
                <span className="text-xs text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity -ml-1 font-semibold flex items-center">
                    Explore All <ChevronRight className="w-4 h-4" />
                </span>
            </div>

            {/* Content Row */}
            <div className="relative w-full">
                {isLongContent ? (
                    // Auto-scrolling Layout (JS Driven)
                    <div
                        ref={containerRef}
                        className="group relative w-full overflow-hidden select-none"
                    >


                        {/* Gradient Masks for smooth fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#121212] to-transparent z-10 pointer-events-none" />

                        {/* Scrolling Container - Switch to overflow-x-auto for native trackpad support */}
                        <div
                            ref={contentRef}
                            className={`flex gap-4 md:gap-6 w-full overflow-x-auto scrollbar-hide px-4 ${rowHeightClass} items-center cursor-grab active:cursor-grabbing select-none`}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >


                            {displayProjects.map((project, idx) => (
                                <div key={`${project.id}-${idx}`} className="pointer-events-auto h-full flex-shrink-0">
                                    <StreamingProjectCard

                                        project={project}
                                        isLandscape={isLandscape}
                                        variableWidth={true}
                                        onClick={() => {
                                            // Only trigger click if NOT dragging
                                            if (!isDragging.current) {
                                                onProjectClick?.(project);
                                            }
                                        }}
                                    />

                                </div>
                            ))}
                        </div>

                    </div>
                ) : (
                    // Standard Manual Scroll Layout (for short content)
                    <div className="group relative md:-ml-2">
                        <ChevronLeft
                            className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-24 w-12 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 text-white drop-shadow-lg ${!isMoved && 'hidden'}`}
                            onClick={() => handleClick('left')}
                        />

                        <div
                            ref={rowRef}
                            className={`flex items-start space-x-4 overflow-x-scroll scrollbar-hide md:space-x-4 px-4 md:px-12 pb-8 pt-4 ${rowHeightClass}`}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >

                            {projects.map((project) => (
                                <StreamingProjectCard
                                    key={project.id}
                                    project={project}
                                    isLandscape={isLandscape}
                                    variableWidth={true}
                                    onClick={() => onProjectClick?.(project)}

                                />
                            ))}
                        </div>

                        <ChevronRight
                            className="absolute top-0 bottom-0 right-2 z-40 m-auto h-24 w-12 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 text-white drop-shadow-lg"
                            onClick={() => handleClick('right')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
