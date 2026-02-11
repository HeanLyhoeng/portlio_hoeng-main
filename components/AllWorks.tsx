import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase, isSupabaseConfigured } from '../Nuel-folio ux_ui-portfolio/src/supabase';
import { ChevronLeft, X } from 'lucide-react';

type ItemCategory = 'Graphic Design' | 'Video Editing' | 'Web Design' | 'Portfolio';

interface GalleryItem {
    id: string;
    title: string;
    category: ItemCategory;
    imageUrl: string;
    aspectRatio: string; // 'aspect-[2/3]' or 'aspect-video'
    videoUrl?: string;
}

interface AllWorksProps {
    onBack?: () => void;
}

export const AllWorks: React.FC<AllWorksProps> = ({ onBack }) => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    // Helper to shuffle array
    const shuffleArray = (array: GalleryItem[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Helper to extract YouTube ID (copied logic)
    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        let cancelled = false;

        const fetchAllData = async () => {
            if (!isSupabaseConfigured || !supabase) {
                if (!cancelled) setLoading(false);
                return;
            }

            try {
                if (!cancelled) setLoading(true);
                if (!cancelled) setFetchError(null);
                // Execute all fetches in parallel
                const results = await Promise.allSettled([
                    // 1. Graphic Design (Storage: project-nanobot)
                    supabase.storage
                        .from('projects')
                        .list('project-nanobot', {
                            limit: 100,
                            offset: 0,
                            sortBy: { column: 'created_at', order: 'desc' }
                        }),

                    // 2. Portfolio (Storage: project-thumbnails)
                    supabase.storage
                        .from('projects')
                        .list('project-thumbnails', {
                            limit: 100,
                            offset: 0,
                            sortBy: { column: 'created_at', order: 'desc' }
                        }),

                    // 3. Video Editing (Table: video_links)
                    supabase
                        .from('video_links')
                        .select('*')
                        .limit(100),

                    // 4. Web Design (Table: projects, category === 'WEB DESIGN')
                    supabase
                        .from('projects')
                        .select('id, title, category, image_url, created_at') // Optimized selection
                        .eq('category', 'WEB DESIGN')
                        .limit(100)
                ]);

                const gatheredItems: GalleryItem[] = [];
                const [graphicRes, portfolioRes, videoRes, webRes] = results;

                // 1. Process Graphic
                if (graphicRes.status === 'fulfilled') {
                    const { data, error } = graphicRes.value;
                    if (error) {
                        console.error('[AllWorks] Graphic fetch FAILED:', error);
                    } else if (data) {
                        const graphics = data
                            .filter(file => file.name !== '.emptyFolderPlaceholder')
                            .map((file, index) => {
                                const { data } = supabase.storage
                                    .from('projects')
                                    .getPublicUrl(`project-nanobot/${file.name}`);

                                return {
                                    id: `graphic-${index}`,
                                    title: file.name.split('.')[0].replace(/-/g, ' '),
                                    category: 'Graphic Design' as ItemCategory,
                                    imageUrl: data.publicUrl,
                                    aspectRatio: 'aspect-[2/3]'
                                };
                            });
                        gatheredItems.push(...graphics);
                    }
                } else {
                    console.error('[AllWorks] Graphic fetch EXCEPTION:', graphicRes.reason);
                }

                // 2. Process Portfolio
                if (portfolioRes.status === 'fulfilled') {
                    const { data, error } = portfolioRes.value;
                    if (error) {
                        console.error('[AllWorks] Portfolio fetch FAILED:', error);
                    } else if (data) {
                        const portfolios = data
                            .filter(file => file.name !== '.emptyFolderPlaceholder')
                            .map((file, index) => {
                                const { data } = supabase.storage
                                    .from('projects')
                                    .getPublicUrl(`project-thumbnails/${file.name}`);

                                return {
                                    id: `portfolio-${index}`,
                                    title: file.name.split('.')[0].replace(/-/g, ' '),
                                    category: 'Portfolio' as ItemCategory,
                                    imageUrl: data.publicUrl,
                                    aspectRatio: 'aspect-video'
                                };
                            });
                        gatheredItems.push(...portfolios);
                    }
                } else {
                    console.error('[AllWorks] Portfolio fetch EXCEPTION:', portfolioRes.reason);
                }

                // 3. Process Video
                if (videoRes.status === 'fulfilled') {
                    const { data, error } = videoRes.value;
                    if (error) {
                        console.error('[AllWorks] Video fetch FAILED:', error);
                    } else if (data) {
                        const videos = data.map((item: any, index: number) => {
                            const videoId = getYoutubeId(item.youtube_url);
                            return {
                                id: item.id?.toString() || `video-${index}`,
                                title: item.project_ref || 'Untitled Video',
                                category: 'Video Editing' as ItemCategory,
                                imageUrl: videoId
                                    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                                    : 'https://placehold.co/400x600/1a1a1a/white?text=No+Thumbnail',
                                aspectRatio: 'aspect-video',
                                videoUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : undefined
                            };
                        });
                        gatheredItems.push(...videos);
                    }
                } else {
                    console.error('[AllWorks] Video fetch EXCEPTION:', videoRes.reason);
                }

                // 4. Process Web
                if (webRes.status === 'fulfilled') {
                    const { data, error } = webRes.value;
                    if (error) {
                        console.error('[AllWorks] Web fetch FAILED:', error);
                    } else if (data) {
                        const webItems = data.map((item: any, index: number) => ({
                            id: item.id?.toString() || `web-${index}`,
                            title: item.title,
                            category: 'Web Design' as ItemCategory,
                            imageUrl: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
                            aspectRatio: 'aspect-[2/3]'
                        }));
                        gatheredItems.push(...webItems);
                    }
                } else {
                    console.error('[AllWorks] Web fetch EXCEPTION:', webRes.reason);
                }

                const shuffled = shuffleArray(gatheredItems);
                if (!cancelled) setItems(shuffled);
            } catch (error) {
                console.error('[AllWorks] Critical error in fetchAllData:', error);
                if (!cancelled) setFetchError('Failed to load gallery. Please refresh the page.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAllData();
        return () => { cancelled = true; };
    }, []);

    // Handle back via prop or hash
    const handleBackClick = () => {
        if (onBack) {
            onBack();
        } else {
            window.location.hash = '';
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <button
                    onClick={handleBackClick}
                    className="p-2 bg-gray-800/50 rounded-full hover:bg-neon-primary hover:text-black transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        All Works
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Explore the complete collection
                    </p>
                </div>
            </div>

            {/* Content */}
            {fetchError ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <p className="text-gray-400 mb-4">{fetchError}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-neon-primary/20 hover:bg-neon-primary/30 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-neon-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mx-auto pb-20">
                    {items.map((item) => (
                        <div key={item.id} className="break-inside-avoid mb-6">
                            <div
                                className="group relative rounded-xl overflow-hidden bg-zinc-900/50 cursor-pointer"
                                onClick={() => {
                                    console.log('Clicked item:', item.title);
                                    setSelectedItem(item);
                                }}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-auto block"
                                    loading="lazy"
                                    decoding="async"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-xs font-bold text-neon-primary uppercase tracking-wider mb-2">
                                        {item.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-white line-clamp-2">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-20">
                            No projects found.
                        </div>
                    )}
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-all duration-300"
                    onClick={() => setSelectedItem(null)}
                >
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-[101]"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <div
                        className="relative max-w-[90vw] max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedItem.category === 'Video Editing' && selectedItem.videoUrl ? (
                            <iframe
                                src={selectedItem.videoUrl}
                                title={selectedItem.title}
                                className="w-[80vw] h-[80vh] rounded-lg shadow-2xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <img
                                src={selectedItem.imageUrl}
                                alt={selectedItem.title}
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                loading="lazy"
                                decoding="async"
                            />
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white rounded-b-lg opacity-0 hover:opacity-100 transition-opacity">
                            <h3 className="text-xl font-bold">{selectedItem.title}</h3>
                            <p className="text-sm text-neon-primary">{selectedItem.category}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};