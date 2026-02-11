import React, { useEffect, useState } from 'react';
import { StreamingHero, HeroSliderItem } from './ui/StreamingHero';
import { CategoryRow } from './ui/CategoryRow';
import { ProjectData } from './ui/StreamingProjectCard';
import { SectionHeading } from './ui/SectionHeading';
import { supabase, isSupabaseConfigured } from '../Nuel-folio ux_ui-portfolio/src/supabase';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VideoPlayerModal } from './ui/VideoPlayerModal';
import { ImageViewerModal } from './ui/ImageViewerModal';

export const ExploreMyWork: React.FC = () => {
    const navigate = useNavigate();
    const [graphicProjects, setGraphicProjects] = useState<ProjectData[]>([]);
    const [videoProjects, setVideoProjects] = useState<ProjectData[]>([]);
    const [webProjects, setWebProjects] = useState<ProjectData[]>([]);
    const [portfolioProjects, setPortfolioProjects] = useState<ProjectData[]>([]);
    const [heroSliderItems, setHeroSliderItems] = useState<HeroSliderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Video Modal State
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Image Modal State
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // Helper to extract YouTube ID
    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            if (!isSupabaseConfigured || !supabase) {
                if (!cancelled) setLoading(false);
                return;
            }

            try {
                if (!cancelled) setLoading(true);
                if (!cancelled) setFetchError(null);

                // Use Promise.allSettled to prevent one failure from breaking everything
                const results = await Promise.allSettled([
                    // 1. Graphic Design: Storage
                    supabase.storage.from('projects').list('nanobot', { limit: 50, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),

                    // 2. Portfolio & Misc: Storage
                    supabase.storage.from('projects').list('project-thumbnails', { limit: 50, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),

                    // 3. Video Editing: Table
                    supabase.from('video_links').select('*').limit(25),

                    // 4. Hero Slider
                    (supabase as any).from('hero_slider').select('id, title, description, category, image_url, video_url, display_order').order('display_order', { ascending: true }).limit(10),

                    // 5. Graphic Design DB (Specific Query)
                    supabase.from('projects')
                        .select('id, title, category, image_url, created_at')
                        .ilike('category', '%GRAPHIC%')
                        .order('created_at', { ascending: false })
                        .limit(20),

                    // 6. Portfolio DB (Specific Query)
                    supabase.from('projects')
                        .select('id, title, category, image_url, created_at')
                        .or('category.ilike.%PORTFOLIO%,category.ilike.%THUMBNAIL%,category.ilike.%MISC%')
                        .order('created_at', { ascending: false })
                        .limit(20),

                    // 7. Web Design DB (Specific Query)
                    supabase.from('projects')
                        .select('id, title, category, image_url, created_at')
                        .or('category.eq.WEB DESIGN,category.eq.WEB,category.ilike.%UI/UX%')
                        .order('created_at', { ascending: false })
                        .limit(20)
                ]);

                const [
                    graphicStorageRes,
                    portfolioStorageRes,
                    videoRes,
                    heroSliderRes,
                    graphicDbRes,
                    portfolioDbRes,
                    webDbRes
                ] = results;

                // Helper to safely get data from settled promise
                if (cancelled) return;

                const getData = (result: PromiseSettledResult<any>) =>
                    (result.status === 'fulfilled' && result.value.data) ? result.value.data : [];

                const graphicStorageData = getData(graphicStorageRes);
                const portfolioStorageData = getData(portfolioStorageRes);
                const videoData = getData(videoRes);
                const heroSliderData = getData(heroSliderRes);
                const graphicDbData = getData(graphicDbRes);
                const portfolioDbData = getData(portfolioDbRes);
                const webDbData = getData(webDbRes);

                // Log errors if any (optional but good for debugging)
                results.forEach((res, idx) => {
                    if (res.status === 'rejected') console.error(`Fetch index ${idx} failed:`, res.reason);
                });

                // --- PROCESSING & FALLBACK STRATEGY ---

                // 1. Graphic Design
                const storageGraphics = graphicStorageData
                    .filter((file: any) => file.name !== '.emptyFolderPlaceholder')
                    .map((file: any, index: number) => {
                        const { data } = supabase.storage.from('projects').getPublicUrl(`nanobot/${file.name}`);
                        return {
                            id: `graphic-storage-${index}`,
                            title: file.name.split('.')[0].replace(/-/g, ' '),
                            category: 'Graphic Design',
                            image: data.publicUrl,
                            year: '2024',
                            isNew: index < 2
                        };
                    });

                const dbGraphics = graphicDbData.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: 'Graphic Design',
                    image: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
                    year: new Date(item.created_at).getFullYear().toString(),
                }));

                if (cancelled) return;
                setGraphicProjects([...storageGraphics, ...dbGraphics]);

                // 2. Portfolio / Thumbnail
                const storagePortfolio = portfolioStorageData
                    .filter((file: any) => file.name !== '.emptyFolderPlaceholder')
                    .map((file: any, index: number) => {
                        const { data } = supabase.storage.from('projects').getPublicUrl(`project-thumbnails/${file.name}`);
                        return {
                            id: `portfolio-storage-${index}`,
                            title: file.name.split('.')[0].replace(/-/g, ' '),
                            category: 'Portfolio',
                            image: data.publicUrl,
                            year: '2024'
                        };
                    });

                const dbPortfolio = portfolioDbData.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: 'Portfolio',
                    image: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
                    year: new Date(item.created_at).getFullYear().toString(),
                }));

                if (cancelled) return;
                setPortfolioProjects([...storagePortfolio, ...dbPortfolio]);

                // 3. Web Design
                const dbWeb = webDbData.map((item: any, index: number) => ({
                    id: item.id,
                    title: item.title,
                    category: 'Web Design',
                    image: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
                    year: new Date(item.created_at).getFullYear().toString(),
                    isNew: index < 1
                }));

                if (cancelled) return;
                setWebProjects(dbWeb);

                // 4. Video Editing
                if (videoData.length > 0) {
                    const videos = videoData.map((item: any, index: number) => {
                        const videoId = getYoutubeId(item.youtube_url);
                        return {
                            id: item.id?.toString() || `video-${index}`,
                            title: item.project_ref || 'Untitled Video',
                            category: 'Video Editing',
                            image: videoId
                                ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                                : 'https://placehold.co/400x600/1a1a1a/white?text=No+Thumbnail',
                            year: '2024',
                            isFeatured: index === 0,
                            videoUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : undefined
                        };
                    });
                    if (!cancelled) setVideoProjects(videos);
                }

                // 5. Hero Slider Items
                if (heroSliderData.length > 0) {
                    const heroItems: HeroSliderItem[] = heroSliderData.map((item: any) => ({
                        id: item.id?.toString() || `hero-${item.display_order}`,
                        title: item.title || 'Untitled Project',
                        description: item.description || '',
                        category: item.category || 'PROJECT',
                        image_url: item.image_url || null,
                        video_url: item.video_url || null,
                        display_order: item.display_order || 0
                    }));
                    if (!cancelled) setHeroSliderItems(heroItems);
                }
            } catch (error) {
                console.error('Critical error in fetchData:', error);
                if (!cancelled) setFetchError('Failed to load work. Please refresh the page.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, []);

    const handleProjectClick = (project: ProjectData) => {
        if (project.videoUrl) {
            setSelectedVideoUrl(project.videoUrl);
            setIsModalOpen(true);
        } else {
            setSelectedImageUrl(project.image);
            setIsImageModalOpen(true);
        }
    };

    return (
        <section id="work" className="bg-black min-h-screen pb-20 overflow-x-hidden">
            <VideoPlayerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoUrl={selectedVideoUrl}
            />

            <ImageViewerModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                imageUrl={selectedImageUrl}
                title={selectedVideoUrl ? undefined : undefined} // We could pass a title if we want
            />

            {/* 1. Cinematic Hero Section */}
            <StreamingHero heroItems={heroSliderItems} />

            {/* Spacing / Transition */}
            <div className="relative -mt-20 md:-mt-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pt-20 px-4 md:px-12 pb-4 flex items-end justify-between">
                <SectionHeading
                    title="Explore My Work"
                    subtitle="A curated selection of my latest projects across all disciplines."
                    titleColor="white"
                    subtitleColor="electric"
                />

                <button
                    onClick={() => navigate('/all-works')}
                    className="hidden md:flex items-center gap-1 text-white font-bold hover:text-white transition-colors mb-6 text-sm uppercase tracking-wider relative z-[9999] cursor-pointer"
                >
                    Explore All <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* 2. Category Rows */}
            <div className="space-y-8 md:space-y-12 pl-0 md:pl-4 min-h-[400px]">
                {fetchError ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <p className="text-gray-400 mb-4">{fetchError}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : loading ? (
                    <div className="space-y-12">
                        {[1, 2, 3].map((i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {(() => {
                            // Calculate visible sections to assign correct alternating indices
                            const visibleSections = [
                                {
                                    id: 'graphic', show: graphicProjects.length > 0, component: (idx: number, total: number) => (
                                        <CategoryRow
                                            key="graphic"
                                            title="Graphic Design"
                                            projects={graphicProjects}
                                            onProjectClick={handleProjectClick}
                                            rowIndex={idx}
                                            totalRows={total}
                                        />
                                    )
                                },
                                {
                                    id: 'video', show: videoProjects.length > 0, component: (idx: number, total: number) => (
                                        <CategoryRow
                                            key="video"
                                            title="Video Editing"
                                            projects={videoProjects}
                                            isLandscape={true}
                                            onProjectClick={handleProjectClick}
                                            rowIndex={idx}
                                            totalRows={total}
                                        />
                                    )
                                },
                                {
                                    id: 'web', show: webProjects.length > 0, component: (idx: number, total: number) => (
                                        <CategoryRow
                                            key="web"
                                            title="Web Design"
                                            projects={webProjects}
                                            onProjectClick={handleProjectClick}
                                            rowIndex={idx}
                                            totalRows={total}
                                        />
                                    )
                                },
                                {
                                    id: 'portfolio', show: portfolioProjects.length > 0, component: (idx: number, total: number) => (
                                        <CategoryRow
                                            key="portfolio"
                                            title="Portfolio & Misc"
                                            projects={portfolioProjects}
                                            isLandscape={true}
                                            onProjectClick={handleProjectClick}
                                            rowIndex={idx}
                                            totalRows={total}
                                        />
                                    )
                                }
                            ].filter(s => s.show);

                            return visibleSections.map((section, idx) => section.component(idx, visibleSections.length));
                        })()}
                    </>
                )}
            </div>
        </section>
    );
};

// Skeleton Components for improved perceived performance
const SkeletonRow = () => (
    <div className="mb-8">
        {/* Title Skeleton */}
        <div className="h-6 w-48 bg-gray-800 rounded mb-4 animate-pulse ml-4 md:ml-0" />

        {/* Cards Row */}
        <div className="flex gap-4 overflow-hidden px-4 md:px-0">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-none w-[280px] md:w-[320px] aspect-video bg-gray-900 rounded-lg animate-pulse border border-gray-800/50">
                    <div className="h-full w-full bg-gradient-to-br from-gray-800/50 to-transparent" />
                </div>
            ))}
        </div>
    </div>
);
