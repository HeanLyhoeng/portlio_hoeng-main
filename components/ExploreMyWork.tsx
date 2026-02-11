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
        const fetchData = async () => {
            if (!isSupabaseConfigured || !supabase) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const [
                    graphicRes,
                    portfolioRes,
                    videoRes,
                    allProjectsRes,
                    heroSliderRes // Fetch hero slider data
                ] = await Promise.all([
                    // 1. Graphic Design: Storage (Try, but fallback to DB)
                    supabase.storage.from('projects').list('nanobot', { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),

                    // 2. Portfolio & Misc: Storage (Try, but fallback to DB)
                    supabase.storage.from('projects').list('project-thumbnails', { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),

                    // 3. Video Editing: Table -> video_links
                    supabase.from('video_links').select('*'),

                    // 4. Fetch ALL projects from DB to distribute/fallback
                    supabase.from('projects').select('*').order('created_at', { ascending: false }),

                    // 5. Fetch hero slider items from hero_slider table
                    supabase
                        .from('hero_slider')
                        .select('id, title, description, category, image_url, video_url, display_order')
                        .order('display_order', { ascending: true })
                        .limit(10)
                ]);

                console.log('--- SUPABASE DEBUG START ---');
                console.log('1. Graphic Storage (nanobot):', JSON.stringify({ data: graphicRes.data, error: graphicRes.error }, null, 2));
                console.log('2. Portfolio Storage (project-thumbnails):', JSON.stringify({ data: portfolioRes.data, error: portfolioRes.error }, null, 2));
                console.log('3. Video Links Table:', JSON.stringify({ data: videoRes.data, error: videoRes.error }, null, 2));
                console.log('4. Projects Table (DB):', JSON.stringify({ data: allProjectsRes.data, error: allProjectsRes.error }, null, 2));
                console.log('5. Hero Slider Table:', JSON.stringify({ data: heroSliderRes.data, error: heroSliderRes.error }, null, 2));

                // --- PROCESSING & FALLBACK STRATEGY ---
                const dbProjects = allProjectsRes.data || [];

                // 1. Graphic Design: Combine Storage + DB
                const storageGraphics = (graphicRes.data || [])
                    .filter(file => file.name !== '.emptyFolderPlaceholder')
                    .map((file, index) => {
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

                const dbGraphics = dbProjects.filter((p: any) =>
                    p.category && p.category.toUpperCase().includes('GRAPHIC')
                ).map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: 'Graphic Design',
                    image: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
                    year: new Date(item.created_at).getFullYear().toString(),
                }));

                setGraphicProjects([...storageGraphics, ...dbGraphics]);

                // 2. Portfolio / Thumbnail: Combine Storage + DB
                const storagePortfolio = (portfolioRes.data || [])
                    .filter(file => file.name !== '.emptyFolderPlaceholder')
                    .map((file, index) => {
                        const { data } = supabase.storage.from('projects').getPublicUrl(`project-thumbnails/${file.name}`);
                        return {
                            id: `portfolio-storage-${index}`,
                            title: file.name.split('.')[0].replace(/-/g, ' '),
                            category: 'Portfolio',
                            image: data.publicUrl,
                            year: '2024'
                        };
                    });

                const dbPortfolio = dbProjects.filter((p: any) => {
                    const cat = p.category ? p.category.toUpperCase() : '';
                    return cat.includes('PORTFOLIO') || cat.includes('THUMBNAIL') || cat.includes('MISC');
                }).map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: 'Portfolio',
                    image: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
                    year: new Date(item.created_at).getFullYear().toString(),
                }));

                setPortfolioProjects([...storagePortfolio, ...dbPortfolio]);

                // 3. Web Design: Strictly DB (Filter from ALL projects)
                const dbWeb = dbProjects.filter((p: any) => {
                    const cat = p.category ? p.category.toUpperCase() : '';
                    return cat === 'WEB DESIGN' || cat === 'WEB' || cat.includes('UI/UX');
                }).map((item: any, index: number) => ({
                    id: item.id,
                    title: item.title,
                    category: 'Web Design',
                    image: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
                    year: new Date(item.created_at).getFullYear().toString(),
                    isNew: index < 1
                }));

                setWebProjects(dbWeb);

                // 4. Video Editing (Keep existing working logic)
                if (videoRes.data) {
                    const videos = videoRes.data.map((item: any, index: number) => {
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
                    setVideoProjects(videos);
                }

                // 5. Hero Slider Items
                if (heroSliderRes.data && heroSliderRes.data.length > 0) {
                    const heroItems: HeroSliderItem[] = heroSliderRes.data.map((item: any) => ({
                        id: item.id?.toString() || `hero-${item.display_order}`,
                        title: item.title || 'Untitled Project',
                        description: item.description || '',
                        category: item.category || 'PROJECT',
                        image_url: item.image_url || null,
                        video_url: item.video_url || null,
                        display_order: item.display_order || 0
                    }));
                    setHeroSliderItems(heroItems);
                    console.log(`[ExploreMyWork] Loaded ${heroItems.length} hero slider items`);
                } else {
                    console.warn('[ExploreMyWork] No hero slider items found in database');
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
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
