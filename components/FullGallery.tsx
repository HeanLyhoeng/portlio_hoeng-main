import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../Nuel-folio ux_ui-portfolio/src/supabase';
import { ProjectData } from './ui/StreamingProjectCard';
import { StreamingHero, HeroSliderItem } from './ui/StreamingHero';

interface FullGalleryProps {
  onBack?: () => void;
}

export const FullGallery: React.FC<FullGalleryProps> = ({ onBack }) => {
  const [graphicProjects, setGraphicProjects] = useState<ProjectData[]>([]);
  const [videoProjects, setVideoProjects] = useState<ProjectData[]>([]);
  const [webProjects, setWebProjects] = useState<ProjectData[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<ProjectData[]>([]);
  const [heroSliderItems, setHeroSliderItems] = useState<HeroSliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to extract YouTube ID (copied logic)
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    console.log('🔥 NEW FULL GALLERY LOADED 🔥');

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
          supabase.storage
            .from('projects')
            .list('nanobot', { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),

          // 2. Portfolio & Misc: Storage (Try, but fallback to DB)
          supabase.storage
            .from('projects')
            .list('project-thumbnails', { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),

          // 3. Video Editing: Table -> video_links
          supabase.from('video_links').select('*'),

          // 4. Fetch ALL projects from DB to filter manually
          supabase.from('projects').select('*').order('created_at', { ascending: false }),

          // 5. Fetch hero slider items from hero_slider table
          supabase
            .from('hero_slider')
            .select('id, title, description, category, image_url, video_url, display_order')
            .order('display_order', { ascending: true })
            .limit(10)
        ]);

        console.log('--- FULL GALLERY SUPABASE DEBUG START ---');
        console.log(
          '1. Graphic Storage (nanobot):',
          JSON.stringify({ data: graphicRes.data, error: graphicRes.error }, null, 2)
        );
        console.log(
          '2. Portfolio Storage (project-thumbnails):',
          JSON.stringify({ data: portfolioRes.data, error: portfolioRes.error }, null, 2)
        );
        console.log(
          '3. Video Links Table:',
          JSON.stringify({ data: videoRes.data, error: videoRes.error }, null, 2)
        );
        console.log(
          '4. Projects Table (DB):',
          JSON.stringify({ data: allProjectsRes.data, error: allProjectsRes.error }, null, 2)
        );
        console.log(
          '5. Hero Slider Table:',
          JSON.stringify({ data: heroSliderRes.data, error: heroSliderRes.error }, null, 2)
        );

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

        const dbGraphics = dbProjects
          .filter((p: any) => p.category && p.category.toUpperCase().includes('GRAPHIC'))
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            category: 'Graphic Design',
            image: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
            year: new Date(item.created_at).getFullYear().toString()
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

        const dbPortfolio = dbProjects
          .filter((p: any) => {
            const cat = p.category ? p.category.toUpperCase() : '';
            return cat.includes('PORTFOLIO') || cat.includes('THUMBNAIL') || cat.includes('MISC');
          })
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            category: 'Portfolio',
            image: item.image_url || 'https://placehold.co/400x600/1a1a1a/white?text=No+Image',
            year: new Date(item.created_at).getFullYear().toString()
          }));

        setPortfolioProjects([...storagePortfolio, ...dbPortfolio]);

        // 3. Web Design: Strictly DB (Filter from ALL projects)
        const dbWeb = dbProjects
          .filter((p: any) => {
            const cat = p.category ? p.category.toUpperCase() : '';
            return cat === 'WEB DESIGN' || cat === 'WEB' || cat.includes('UI/UX');
          })
          .map((item: any, index: number) => ({
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
          console.log(`[FullGallery] Loaded ${heroItems.length} hero slider items`);
        } else {
          console.warn('[FullGallery] No hero slider items found in database');
        }

      } catch (error) {
        console.error('Error fetching data for FullGallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasAnyProjects =
    graphicProjects.length ||
    videoProjects.length ||
    webProjects.length ||
    portfolioProjects.length;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800 px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-900/80 hover:bg-neon-primary hover:text-black transition-colors text-sm font-medium border border-gray-700 hover:border-neon-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <div className="text-right">
          <h1 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Full Gallery
          </h1>
          <p className="text-[11px] md:text-xs text-gray-400">
            All graphic, web, video, and portfolio work.
          </p>
        </div>
      </div>
      {/* Hero Slider - Half Height */}
      <div className="relative w-full h-[50vh] overflow-hidden mt-16 md:mt-20">
        <StreamingHero heroItems={heroSliderItems} minimal={true} className="h-full" />
      </div>

      {/* Title Divider */}
      <div className="px-4 md:px-8 mb-6 mt-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white border-l-4 border-neon-primary pl-4">
          All Projects
        </h2>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-neon-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasAnyProjects ? (
          <div className="text-center text-gray-500 py-20">
            No projects found for the full gallery.
          </div>
        ) : (
          <div className="space-y-10 pb-20">
            {/* Graphic Design Section */}
            {graphicProjects.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                      Graphic Design
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400">
                      Posters, campaigns, and visual identity explorations.
                    </p>
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-wide text-gray-500">
                    {graphicProjects.length} items
                  </span>
                </div>
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {graphicProjects.map(p => (
                    <div key={p.id} className="break-inside-avoid mb-4">
                      <div className="group relative rounded-xl overflow-hidden bg-zinc-900/50">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-auto block"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                          <span className="text-[10px] md:text-xs font-bold text-neon-primary uppercase tracking-wider mb-1 md:mb-2">
                            Graphic Design
                          </span>
                          <h3 className="text-sm md:text-lg font-bold text-white line-clamp-2">
                            {p.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Video Editing Section */}
            {videoProjects.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                      Video Editing
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400">
                      Trailers, promos, and cinematic storytelling.
                    </p>
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-wide text-gray-500">
                    {videoProjects.length} items
                  </span>
                </div>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {videoProjects.map(p => (
                    <div key={p.id} className="break-inside-avoid mb-4">
                      <div className="group relative rounded-xl overflow-hidden bg-zinc-900/50">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-auto block"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                          <span className="text-[10px] md:text-xs font-bold text-neon-primary uppercase tracking-wider mb-1 md:mb-2">
                            Video Editing
                          </span>
                          <h3 className="text-sm md:text-lg font-bold text-white line-clamp-2">
                            {p.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Web Design Section */}
            {webProjects.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                      Web Design
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400">
                      Interfaces, product sites, and digital experiences.
                    </p>
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-wide text-gray-500">
                    {webProjects.length} items
                  </span>
                </div>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {webProjects.map(p => (
                    <div key={p.id} className="break-inside-avoid mb-4">
                      <div className="group relative rounded-xl overflow-hidden bg-zinc-900/50">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-auto block"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                          <span className="text-[10px] md:text-xs font-bold text-neon-primary uppercase tracking-wider mb-1 md:mb-2">
                            Web Design
                          </span>
                          <h3 className="text-sm md:text-lg font-bold text-white line-clamp-2">
                            {p.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Portfolio & Misc Section */}
            {portfolioProjects.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                      Portfolio & Misc
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400">
                      Thumbnails, experiments, and supporting visuals.
                    </p>
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-wide text-gray-500">
                    {portfolioProjects.length} items
                  </span>
                </div>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {portfolioProjects.map(p => (
                    <div key={p.id} className="break-inside-avoid mb-4">
                      <div className="group relative rounded-xl overflow-hidden bg-zinc-900/50">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-auto block"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                          <span className="text-[10px] md:text-xs font-bold text-neon-primary uppercase tracking-wider mb-1 md:mb-2">
                            Portfolio &amp; Misc
                          </span>
                          <h3 className="text-sm md:text-lg font-bold text-white line-clamp-2">
                            {p.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

