import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Controller } from 'swiper/modules';
import 'swiper/css';
import { supabase, isSupabaseConfigured } from '../Nuel-folio ux_ui-portfolio/src/supabase';

interface ProjectItem {
  id: string;
  image_url: string;
  title: string;
  category: string;
}

/**
 * AboutThumnails Component (Redesigned)
 * 
 * Displays images from Supabase storage bucket 'projects/about-thumbnails/'
 * in an Apple TV+ Homepage style with a Static Grid Layout.
 * 
 * Final Polish:
 * - True Full Width (Edge-to-Edge)
 * - Static Images (No Animation)
 * - Sharper Corners (rounded-md)
 */
export const AboutThumnails: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstSwiper, setFirstSwiper] = useState<any>(null);
  const [secondSwiper, setSecondSwiper] = useState<any>(null);

  // Dummy fallback data: 10 placeholder images
  const fallbackProjects: ProjectItem[] = Array.from({ length: 10 }).map((_, index) => ({
    id: `dummy-${index + 1}`,
    image_url: `https://picsum.photos/seed/about-${index + 1}/1600/900`,
    title: `Placeholder ${index + 1}`,
    category: 'Gallery',
  }));

  // Helper to extract title from filename
  // "01-Project-Name.jpg" -> "Project Name"
  const formatTitle = (filename: string): string => {
    const nameWithoutExt = filename.split('.')[0];
    // Remove leading numbers (e.g. "01", "01-")
    const cleanName = nameWithoutExt.replace(/^\d+[-_]?/, '');
    return cleanName.replace(/[-_]/g, ' ');
  };

  // Helper function to check if an item is a file
  const isFile = (item: any): boolean => {
    return !!(item.metadata || item.id || (item.updated_at && !item.name.endsWith('/')));
  };

  // Helper to recursively fetch all images
  const fetchAllImagesFromFolder = async (folderPath: string): Promise<ProjectItem[]> => {
    const allProjects: ProjectItem[] = [];
    console.log(`[AboutThumnails] Attempting to fetch from folder: "${folderPath}"`);

    const listRecursive = async (path: string): Promise<void> => {
      try {
        const { data: items, error } = await supabase!.storage
          .from('projects')
          .list(path, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

        if (error) {
          console.error(`[AboutThumnails] Error listing "${path}":`, error);
          return;
        }

        if (!items || items.length === 0) return;

        for (const item of items) {
          const itemPath = path ? `${path}/${item.name}` : item.name;

          if (isFile(item)) {
            const fileName = item.name.toLowerCase();
            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/.test(fileName);

            if (isImage) {
              const { data } = supabase!.storage.from('projects').getPublicUrl(itemPath);
              allProjects.push({
                id: item.id || itemPath,
                image_url: data.publicUrl,
                title: formatTitle(item.name),
                category: 'Gallery' // Default category since we only have files
              });
            }
          } else {
            // Recurse if needed (optional based on folder structure)
            if (!item.name.includes('.')) {
              await listRecursive(itemPath);
            }
          }
        }
      } catch (err: any) {
        console.error(`[AboutThumnails] Error processing folder "${path}":`, err);
      }
    };

    await listRecursive(folderPath);

    // Sort: prioritize explicitly numbered files
    return allProjects.sort((a, b) => {
      // Extract numbers if possible from title or original filename implication
      // For simplicity, relying on the 'list' order which was alphabetic
      return 0; // Keep Supabase sort order (asc by name)
    });
  };

  useEffect(() => {
    const loadImages = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const folderName = 'about-thumbnails';
        const fetchedProjects = await fetchAllImagesFromFolder(folderName);

        if (fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
        } else {
          // Fallback/Mock data if empty so the UI doesn't look broken during dev
          const errorMsg = `No images found in ${folderName}.`;
          console.warn('[AboutThumnails]', errorMsg);
          // Optional: Set mock data here if you want to force show the UI
          setProjects([]);
          setError(errorMsg);
        }
      } catch (err: any) {
        console.error('[AboutThumnails] Error fetching:', err);
        setError(err.message || 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Final data source for the sliders (always 10 items)
  const sliderItems: ProjectItem[] = (() => {
    if (projects.length === 0) {
      return fallbackProjects;
    }
    if (projects.length >= 10) {
      return projects.slice(0, 10);
    }
    // If fewer than 10 from Supabase, top them up with fallback images
    const needed = 10 - projects.length;
    return [...projects, ...fallbackProjects.slice(0, needed)];
  })();

  if (loading) {
    return (
      <section className="py-20 relative bg-[#121212]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">View Our Thumbnails</h2>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-neon-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-10 relative bg-[#000000] overflow-hidden">
      {/* Local styles for Swiper (bottom shelf emphasis only) */}
      <style>{`
        .about-swiper-bottom .swiper-slide {
          transition: opacity 0.25s ease, filter 0.25s ease;
          opacity: 0.45;
          filter: brightness(0.8);
        }

        .about-swiper-bottom .swiper-slide-active {
          opacity: 1;
          transform: scale(1.05);
          filter: brightness(1);
        }
      `}</style>

      <div className="w-full">
        {/* TOP SWIPER – Spotlight */}
        <Swiper
          modules={[Controller, Autoplay]}
          onSwiper={setFirstSwiper}
          controller={{ control: secondSwiper }}
          slidesPerView={'auto'}
          centeredSlides={true}
          loop={true}
          spaceBetween={30}
          autoplay={{
            delay: 2800,
            disableOnInteraction: true, // pause on interaction
            pauseOnMouseEnter: true,
          }}
          className="about-swiper-top w-full h-[60vh] md:h-[70vh] lg:h-[75vh] mb-10"
        >
          {sliderItems.map((item) => (
            <SwiperSlide
              key={item.id}
              className="!w-[88vw] md:!w-[70vw] lg:!w-[65vw] rounded-2xl overflow-hidden relative"
            >
              <div className="relative w-full h-full">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-2xl border border-white/10"
                  loading="lazy"
                  decoding="async"
                />
                {/* Optional subtle bottom gradient for text legibility if you add overlays later */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* BOTTOM SWIPER – Navigation Shelf */}
        <Swiper
          modules={[Controller]}
          onSwiper={setSecondSwiper}
          controller={{ control: firstSwiper }}
          slidesPerView={2.5}
          breakpoints={{
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          centeredSlides={true}
          loop={true}
          spaceBetween={20}
          className="about-swiper-bottom w-full h-[220px] md:h-[280px] mt-4 md:mt-6"
        >
          {sliderItems.map((item, index) => (
            <SwiperSlide
              key={`thumb-${item.id}`}
              className="rounded-xl overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              onClick={() => {
                if (firstSwiper) {
                  firstSwiper.slideToLoop(index);
                }
              }}
            >
              <div className="relative w-full aspect-video">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
