import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { NeonButton } from './ui/NeonButton';
import { supabase, Project as SupabaseProject, isSupabaseConfigured } from '../Nuel-folio ux_ui-portfolio/src/supabase';

interface VideoLink {
  id: string;
  project_ref: string;
  youtube_url: string;
}

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

// Project Interface
interface Project {
  title: string;
  role: string;
  stat: string;
  image: string;
  video: string;
  videoUrls?: string[];
  tags: string[];
  description: string;
  fullDescription: string;
  images: string[];
  category?: string;
  year?: string;
  client?: string;
  headerImages?: string[];
}

// Helper function to generate image paths for a project
const generateProjectImages = (projectSlug: string, count: number = 10): string[] => {
  return Array(count).fill(null).map((_, i) => `/img/projects/${projectSlug}/image-${i + 1}.jpg`);
};

// Helper function to check if a file is a video
const isVideoFile = (filePath: string): boolean => {
  return filePath.toLowerCase().endsWith('.mp4');
};

// Helper function to check if a file is an image
const isImageFile = (filePath: string): boolean => {
  const lowerPath = filePath.toLowerCase();
  return lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg') || lowerPath.endsWith('.png');
};

// Helper functions to extract data from Supabase project
const getRoleFromCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'VIDEO EDITING': 'Video Editing & Motion Graphics',
    'WEB DESIGN': 'Web Development & UI/UX Design',
    'GRAPHIC DESIGN': 'Data Visualization & Social Assets',
    'PORTFOLIO': 'Designer',
  };
  return categoryMap[category] || 'Designer';
};

const getStatFromTitle = (title: string): string => {
  if (title.toLowerCase().includes('solara')) return 'High-energy promotional editing';
  if (title.toLowerCase().includes('orbitpay')) return 'Modern banking website reimagined';
  if (title.toLowerCase().includes('nanobot')) return '3D Mascot & Motion';
  return 'Project showcase';
};

const getTagsFromCategory = (category: string): string[] => {
  const tagMap: Record<string, string[]> = {
    'VIDEO EDITING': ['Video Editing', 'Motion Graphics', 'Sound Design'],
    'WEB DESIGN': ['Web Development', 'UI/UX Design', 'Fintech Branding'],
    'GRAPHIC DESIGN': ['Data Visualization', 'Social Media', 'Infographics', 'Graphic Design'],
  };
  return tagMap[category] || ['Design', 'Portfolio'];
};

const getDescriptionFromCategory = (category: string): string => {
  const descMap: Record<string, string> = {
    'VIDEO EDITING': 'High-energy promotional editing showcasing smart home automation features.',
    'WEB DESIGN': 'Modern banking website reimagined with trust-building typography and sleek motion.',
    'GRAPHIC DESIGN': 'Transforming complex analytics into digestible, stunning infographics for social.',
  };
  return descMap[category] || 'Project details coming soon.';
};

const getFullDescriptionFromCategory = (category: string): string => {
  const fullDescMap: Record<string, string> = {
    'VIDEO EDITING': 'We produced a dynamic launch video combining high-energy editing with clear product demonstrations, using motion graphics to highlight key features. Strategic sound design enhances the modern, tech-forward brand positioning.',
    'WEB DESIGN': 'Complete digital transformation to establish credibility in the competitive fintech space. We developed a modern banking website with trust-building typography, sleek micro-interactions, and a design system that communicates security and innovation.',
    'GRAPHIC DESIGN': 'Comprehensive suite of data visualization assets and infographics that transform raw analytics into digestible, shareable content for social media platforms.',
  };
  return fullDescMap[category] || 'Detailed information about this project will be available soon.';
};

// Project data - in production this would come from an API
// Note: The 'images' array can contain a mix of .jpg, .png, and .mp4 files.
// Videos will be automatically detected and rendered with autoPlay, muted, loop, and playsInline.
// For best performance, ensure videos are compressed and optimized for web delivery.
const projectData: Record<string, Project> = {
  // ID '1': Video Editing
  '1': {
    title: "Solara – Smart Home Launch Video",
    role: "Video Editing & Motion Graphics",
    stat: "High-energy promotional editing",
    image: 'img/Header/H.lyhoeng.jpg',
    video: "/img/Work/Video/1.mp4",
    tags: ["Video Editing", "Motion Graphics", "Sound Design"],
    description: "High-energy promotional editing showcasing smart home automation features.",
    fullDescription: "We produced a dynamic launch video for Solara's smart home automation system. The video combines high-energy editing with clear product demonstrations, using motion graphics to highlight key features. Strategic sound design enhances the modern, tech-forward brand positioning.",
    category: "Video Editing",
    year: "2024",
    client: "Solara",
    // Example: Mix of images and videos - you can add .mp4 files here
    images: [

      ...Array.from({ length: 4 }, (_, i) => `/img/Work/Video/${i + 1}.mp4`),
      // Uncomment and add video paths as needed:
      // '/img/Work/Video/demo-1.mp4',
      // '/img/Work/Video/demo-2.mp4',
    ],

    // Header carousel images - Edit these 3 URLs to change the carousel images
    headerImages: [
      "/img/",
      "/img/projects/solara/image-2.jpg",
      "/img/projects/solara/image-3.jpg"
    ]
  },
  // ID '2': Branding (Nova)
  // id '2': Branding (Nova) ដកចេញសិន
  // ID '3': Web Design (OrbitPay)
  '3': {
    title: "OrbitPay – Corporate Web Presence",
    role: "Web Development & UI/UX Design",
    stat: "Modern banking website reimagined",
    image: "/img/jpg",
    video: "/img/projects/orbitpay/preview.mp4",
    tags: ["Web Development", "UI/UX Design", "Fintech Branding"],
    description: "Modern banking website reimagined with trust-building typography and sleek motion.",
    fullDescription: "OrbitPay needed a complete digital transformation to establish credibility in the competitive fintech space. We developed a modern banking website with trust-building typography, sleek micro-interactions, and a design system that communicates security and innovation. The result is a seamless user experience that converts visitors into customers.",
    category: "Web Design",
    year: "2024",
    client: "OrbitPay",
    images: Array.from({ length: 4 }, (_, i) => `/img/Work/Web/${i + 1}.jpg`),
    // Header carousel images - Edit these 3 URLs to change the carousel images
    headerImages: [
      "/img/Header/H.lyhoeng.jpg",
      "/img/projects/orbitpay/image-2.jpg",
      "/img/projects/orbitpay/image-3.jpg"
    ]
  },
  // ID '4': Graphic Design (Echo)
  '4': {
    title: "Echo – Social Media Data Suite",
    role: "Data Visualization & Social Assets",
    stat: "Transforming complex analytics",
    image: "/img/Echo/1.jpg",
    video: "/img/projects/echo/preview.mp4",
    tags: ["Data Visualization", "Social Media", "Infographics", "Graphic Design"],
    description: "Transforming complex analytics into digestible, stunning infographics for social.",
    fullDescription: "Echo needed to communicate complex social media analytics in a visually compelling way. We designed a comprehensive suite of data visualization assets and infographics that transform raw analytics into digestible, shareable content for social media platforms.",
    category: "Graphic Design",
    year: "2024",
    client: "Echo",
    images: Array.from({ length: 15 }, (_, i) => `/img/Work/Graphic/${i + 1}.jpg`),
    // Header carousel images - Edit these 3 URLs to change the carousel images
    headerImages: [
      "/img/Header/H.lyhoeng.jpg",
      "/img/Header/Car.jpg",
      "/img/Header/wownow.jpg"
    ]
  }
};


export const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [headerCarouselIndex, setHeaderCarouselIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [lightboxVideoRef, setLightboxVideoRef] = useState<HTMLVideoElement | null>(null);
  const [supabaseProject, setSupabaseProject] = useState<SupabaseProject | null>(null);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper function to recursively fetch all images from a storage folder
  const fetchAllImagesFromFolder = async (folderPath: string): Promise<string[]> => {
    const allImages: string[] = [];

    const listRecursive = async (path: string): Promise<void> => {
      try {
        const { data: items, error } = await supabase!.storage
          .from('projects')
          .list(path, {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (error) {
          // If folder doesn't exist or error, return empty array
          if (!error.message.includes('not found')) {
            console.warn(`Error listing ${path}:`, error.message);
          }
          return;
        }

        if (!items || items.length === 0) {
          return;
        }

        for (const item of items) {
          const itemPath = path ? `${path}/${item.name}` : item.name;

          // Check if it's a file (has metadata/id) or folder
          if (item.metadata || item.id) {
            // It's a file - check if it's an image
            const fileName = item.name.toLowerCase();
            const isImage = fileName.endsWith('.jpg') ||
              fileName.endsWith('.jpeg') ||
              fileName.endsWith('.png') ||
              fileName.endsWith('.gif') ||
              fileName.endsWith('.webp') ||
              fileName.endsWith('.svg');

            if (isImage) {
              const { data } = supabase!.storage
                .from('projects')
                .getPublicUrl(itemPath);
              allImages.push(data.publicUrl);
            }
          } else {
            // It's a folder - recurse into it
            await listRecursive(itemPath);
          }
        }
      } catch (err) {
        console.warn(`Error processing folder ${path}:`, err);
      }
    };

    await listRecursive(folderPath);

    // Sort images to prioritize numbered files (01.jpg, 1.jpg, etc.)
    return allImages.sort((a, b) => {
      const aName = a.split('/').pop()?.toLowerCase() || '';
      const bName = b.split('/').pop()?.toLowerCase() || '';

      // Extract numbers from filenames
      const aNum = parseInt(aName.match(/^0?(\d+)/)?.[1] || '999');
      const bNum = parseInt(bName.match(/^0?(\d+)/)?.[1] || '999');

      // If both have numbers, sort by number
      if (!isNaN(aNum) && !isNaN(bNum) && aNum !== 999 && bNum !== 999) {
        return aNum - bNum;
      }

      // Otherwise sort alphabetically
      return aName.localeCompare(bName);
    });
  };

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const cleanedUrl = url.trim();

    const isValidId = (id: string | null | undefined): string | null => {
      if (!id) return null;
      const trimmedId = id.trim();
      return /^[a-zA-Z0-9_-]{11}$/.test(trimmedId) ? trimmedId : null;
    };

    try {
      const parsed = new URL(cleanedUrl);
      const host = parsed.hostname.toLowerCase();

      if (host === 'youtu.be') {
        return isValidId(parsed.pathname.split('/').filter(Boolean)[0]);
      }

      if (host.includes('youtube.com')) {
        const searchId = isValidId(parsed.searchParams.get('v'));
        if (searchId) return searchId;

        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        const embedIndex = pathSegments.findIndex((segment) => segment === 'embed');
        if (embedIndex !== -1) {
          return isValidId(pathSegments[embedIndex + 1]);
        }

        const shortsIndex = pathSegments.findIndex((segment) => segment === 'shorts');
        if (shortsIndex !== -1) {
          return isValidId(pathSegments[shortsIndex + 1]);
        }

        // Last path segment as fallback (e.g., .../v/VIDEO_ID)
        return isValidId(pathSegments[pathSegments.length - 1]);
      }
    } catch {
      // Ignore URL parsing errors and fall back to regex
    }

    const regexMatch = cleanedUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&?/]|$)/);
    return isValidId(regexMatch ? regexMatch[1] : null);
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const getYouTubeThumbnail = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : 'https://via.placeholder.com/640x360/1e293b/00f3ff?text=Video+Unavailable';
  };

  // Fetch project and related videos from Supabase
  useEffect(() => {
    const fetchProject = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setVideoUrls([]);

        // Fetch project by ID
        const { data, error } = await supabase
          .from('projects')
          .select('id,title,category,video_url,image_url,created_at')
          .eq('id', projectId)
          .single();

        if (error) {
          console.error('Error fetching project:', error);
          setLoading(false);
          return;
        }

        if (data) {
          const projectData = data as SupabaseProject;
          setSupabaseProject(projectData);
          let matchedVideoUrls: string[] = [];

          // Fetch all video links and filter by project title
          try {
            const { data: videoData, error: videoError } = await supabase
              .from('video_links')
              .select('id, project_ref, youtube_url');

            if (videoError) {
              console.warn('Error fetching video links:', videoError.message);
            } else if (videoData && projectData.title) {
              const projectTitle = projectData.title.toLowerCase();
              matchedVideoUrls = videoData
                .filter((video: VideoLink) => (
                  video.project_ref &&
                  projectTitle.includes(video.project_ref.toLowerCase())
                ))
                .map((video) => video.youtube_url)
                .filter((url): url is string => Boolean(url));

              setVideoUrls(matchedVideoUrls);
            }
          } catch (videoErr) {
            console.warn('Unexpected error fetching video links:', videoErr);
          }

          // Only fetch storage images when there are no matched video URLs (fallback)
          if (matchedVideoUrls.length === 0) {
            // Extract folder name from project title
            // Handle both formats: "Solara – ..." -> "solara" and "Nanobot 3D Mascot & Motion" -> "nanobot"
            let folderName = projectData.title.split('–')[0].trim().toLowerCase();
            if (folderName === projectData.title.toLowerCase().trim()) {
              folderName = folderName.split(' ')[0].toLowerCase();
            }
            const titleToFolderMap: Record<string, string> = {
              'solara – smart home launch video': 'solara',
              'solara': 'solara',
              'orbitpay – corporate web presence': 'orbitpay',
              'orbitpay': 'orbitpay',
              'nanobot 3d mascot & motion': 'nanobot',
              'nanobot': 'nanobot',
              'thumnail': 'project-thumbnails',
              'thumbnail': 'project-thumbnails',
              'thumbnails': 'project-thumbnails',
            };
            const normalizedTitle = projectData.title.toLowerCase().trim();
            if (titleToFolderMap[normalizedTitle]) {
              folderName = titleToFolderMap[normalizedTitle];
            } else if (normalizedTitle.includes('thumnail') || normalizedTitle.includes('thumbnail')) {
              folderName = 'project-thumbnails';
            }
            try {
              const images = await fetchAllImagesFromFolder(folderName);
              if (images.length > 0) {
                setGalleryImages(images);
              } else {
                setGalleryImages(projectData.image_url ? [projectData.image_url] : []);
              }
            } catch (err) {
              setGalleryImages(projectData.image_url ? [projectData.image_url] : []);
            }
          } else {
            setGalleryImages([]);
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Use Supabase project if available, otherwise fall back to hardcoded data
  const project: Project = supabaseProject ? {
    title: supabaseProject.title,
    role: getRoleFromCategory(supabaseProject.category),
    stat: getStatFromTitle(supabaseProject.title),
    image: supabaseProject.image_url,
    video: supabaseProject.video_url || '',
    videoUrls: videoUrls,
    tags: getTagsFromCategory(supabaseProject.category),
    description: getDescriptionFromCategory(supabaseProject.category),
    fullDescription: getFullDescriptionFromCategory(supabaseProject.category),
    // Use all gallery images from storage, or fallback to image_url
    images: galleryImages.length > 0
      ? galleryImages
      : (supabaseProject.image_url ? [supabaseProject.image_url] : []),
    category: supabaseProject.category,
    year: new Date(supabaseProject.created_at).getFullYear().toString(),
    client: supabaseProject.title.split('–')[0].trim(),
    // Use gallery images for header carousel (first 10, or repeat image_url if needed)
    headerImages: galleryImages.length >= 10
      ? galleryImages.slice(0, 10)
      : galleryImages.length > 0
        ? [...galleryImages, ...Array(10 - galleryImages.length).fill(supabaseProject.image_url)].slice(0, 10)
        : Array(10).fill(supabaseProject.image_url),
  } : projectData[projectId] || {
    title: "Project",
    role: "Designer",
    stat: "Success",
    image: "/img/Header/H.lyhoeng.jpg",
    video: "",
    tags: [],
    description: "Project details coming soon.",
    fullDescription: "Detailed information about this project will be available soon.",
    year: "2024",
    client: "Client",
    category: "Category",
    images: Array(10).fill("/img/Header/H.lyhoeng.jpg"),
    // Header carousel images - Edit these 3 URLs to change the carousel images
    headerImages: [
      "/img/Header/H.lyhoeng.jpg",
      "/img/Header/H.lyhoeng.jpg",
      "/img/Header/H.lyhoeng.jpg"
    ]
  };

  const isEcho = projectId === '4' || (project.title && project.title.toLowerCase().includes('echo'));

  // Use gallery images from storage if available, otherwise fall back to project.images
  // Prioritize galleryImages (from Supabase storage) over project.images (from hardcoded data)
  const projectImages = galleryImages.length > 0
    ? galleryImages
    : (project.images || []);

  const projectVideoUrls = videoUrls.filter(Boolean);

  const displayImages = projectImages.length > 0
    ? projectImages
    : (supabaseProject?.image_url
      ? [supabaseProject.image_url]
      : Array(10).fill("/img/Header/H.lyhoeng.jpg"));

  // Get header carousel images (first 10 from project.images or use project.headerImages if available)
  const headerImages = (project.headerImages || projectImages.slice(0, 10)).filter(Boolean);
  const carouselImages = headerImages.length > 0
    ? headerImages
    : Array(10).fill(project.image);

  // Preload header carousel images
  useEffect(() => {
    if (carouselImages.length === 0) return;

    setImagesLoaded(false);
    setHeaderCarouselIndex(0);

    const preloadImages = () => {
      const imagePromises = carouselImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to continue
          img.src = src;
        });
      });
      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
      });
    };
    preloadImages();
  }, [projectId, carouselImages.length, galleryImages.length]);

  // Auto-rotate carousel every 2.5 seconds
  useEffect(() => {
    if (carouselImages.length <= 1) return;

    // Start carousel immediately, don't wait for images to load
    const interval = setInterval(() => {
      setHeaderCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 2500); // 2.5 seconds (within 2-3 second range)

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    // Pause video before closing
    if (lightboxVideoRef) {
      lightboxVideoRef.pause();
      lightboxVideoRef.currentTime = 0;
    }
    setLightboxOpen(false);
  };

  const nextLightbox = () => {
    // Pause current video if it exists
    if (lightboxVideoRef) {
      lightboxVideoRef.pause();
      lightboxVideoRef.currentTime = 0;
    }
    setLightboxIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevLightbox = () => {
    // Pause current video if it exists
    if (lightboxVideoRef) {
      lightboxVideoRef.pause();
      lightboxVideoRef.currentTime = 0;
    }
    setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  // Handle video playback when lightbox index changes
  useEffect(() => {
    if (lightboxOpen && lightboxVideoRef && isVideoFile(displayImages[lightboxIndex])) {
      lightboxVideoRef.currentTime = 0;
      lightboxVideoRef.play().catch(() => {
        // Handle autoplay restrictions gracefully
      });
    }
  }, [lightboxIndex, lightboxOpen, displayImages]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Pause video before closing
        if (lightboxVideoRef) {
          lightboxVideoRef.pause();
        }
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        // Pause current video if it exists
        if (lightboxVideoRef) {
          lightboxVideoRef.pause();
          lightboxVideoRef.currentTime = 0;
        }
        setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
      } else if (e.key === 'ArrowRight') {
        // Pause current video if it exists
        if (lightboxVideoRef) {
          lightboxVideoRef.pause();
          lightboxVideoRef.currentTime = 0;
        }
        setLightboxIndex((prev) => (prev + 1) % displayImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, displayImages.length, lightboxVideoRef]);

  if (loading) {
    return (
      <section className="project-detail-view min-h-screen pt-0 pb-0 bg-[#181818] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neon-primary border-t-transparent mb-4"></div>
          <p className="text-slate-400 text-sm">Loading project...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="project-detail-view min-h-screen pt-0 pb-0 bg-[#181818]">
      {/* Hero Banner */}
      <div className="w-full relative h-[320px] md:h-[400px] lg:h-[440px] flex items-end overflow-hidden">
        {/* Image Carousel */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <motion.div
            className="flex h-full"
            style={{
              width: `${carouselImages.length * 100}%`,
            }}
            animate={{
              x: `-${(headerCarouselIndex * 100) / carouselImages.length}%`,
            }}
            transition={{
              duration: 1.0, // 1000ms as specified
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {carouselImages.map((img, idx) => (
              <div
                key={`header-carousel-${idx}-${projectId}`}
                className="relative flex-shrink-0 h-full"
                style={{ width: `${100 / carouselImages.length}%` }}
              >
                <img
                  src={img}
                  alt={`${project.title} - Header ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = project.image || "https://via.placeholder.com/1920x1080/1e293b/00f3ff?text=Image+Placeholder";
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pb-8 flex flex-col gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-blue-gradient transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-xs sm:text-sm">Back to Portfolio</span>
          </button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-slate-200 text-sm mb-2">
            <span>{project.year}</span>
            <span className="text-slate-400"></span>
            <span>{project.client}</span>
            <span className="text-slate-400"></span>
            <span>{project.category}</span>
          </div>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl">{project.description}</p>
        </div>
      </div>

      {/* Section Header */}
      <div className="w-full bg-blue-gradient py-3 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-lg md:text-xl font-bold text-white tracking-wide"></span>
        </div>
      </div>

      {/* Video Gallery (from video_links) or Image Gallery (from storage) - 3-column grid */}
      <div className="w-full bg-[#181818] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {projectVideoUrls.length > 0 ? (
            <>
              <div className="mb-4 text-center">
                <p className="text-slate-400 text-sm">Video Gallery</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {projectVideoUrls.map((url, idx) => {
                  const videoId = getYouTubeVideoId(url);
                  const embedUrl = getYouTubeEmbedUrl(url);
                  const thumbnailUrl = getYouTubeThumbnail(url);

                  if (!videoId || !embedUrl) {
                    return (
                      <div
                        key={`${url}-${idx}`}
                        className="relative w-full border border-white/10 bg-white/5 backdrop-blur-md rounded-lg aspect-video flex items-center justify-center text-center px-4 text-xs text-white/70"
                      >
                        Unable to play this video. Please check the URL format.
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${videoId}-${idx}`}
                      className="relative w-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md rounded-lg aspect-video"
                      style={{ backgroundImage: `url(${thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <iframe
                        src={embedUrl}
                        title={`${project.title} video ${idx + 1}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : displayImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No gallery images or videos available for this project.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-center">
                <p className="text-slate-400 text-sm">
                  {displayImages.length} image{displayImages.length !== 1 ? 's' : ''} in gallery
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayImages.map((item: string, idx: number) => {
                  const itemTitle = `${project.title} - ${isVideoFile(item) ? 'Video' : 'Image'} ${idx + 1}`;
                  const isVideo = isVideoFile(item);
                  return (
                    <div
                      key={idx}
                      className="relative w-full cursor-pointer group"
                      onClick={() => openLightbox(idx)}
                    >
                      <div className="relative w-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                        {isVideo ? (
                          <video
                            src={item}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto object-contain object-center group-hover:scale-[1.01] transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLVideoElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <img
                            src={item}
                            alt={itemTitle}
                            className="w-full h-auto object-contain object-center group-hover:scale-[1.01] transition-transform duration-300"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (project.image && target.src !== project.image) {
                                target.src = project.image;
                              } else {
                                target.src = "https://via.placeholder.com/400x400/1e293b/00f3ff?text=Image+Placeholder";
                              }
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project Overview */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Project Overview</h2>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-4">
            {project.description}
          </p>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
            {project.fullDescription}
          </p>
        </div>
        {/* Skill Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md text-white border border-white/10 text-xs sm:text-sm font-raleway hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
              {tag}
            </span>
          ))}
        </div>
        {/* CTA */}
        <div className="text-center">
          <NeonButton variant="white" onClick={onBack} className="w-full sm:w-auto text-black bg-white border border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Back to Portfolio
          </NeonButton>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-[90vh] flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 backdrop-blur-md p-2 rounded-full text-white transition-all"
                aria-label="Close lightbox"
              >
                <X size={24} />
              </button>
              {isVideoFile(displayImages[lightboxIndex]) ? (
                <video
                  ref={setLightboxVideoRef}
                  src={displayImages[lightboxIndex]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <img
                  src={displayImages[lightboxIndex]}
                  alt={`${project.title} - ${isVideoFile(displayImages[lightboxIndex]) ? 'Video' : 'Image'} ${lightboxIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = project.image || "https://via.placeholder.com/1200x800/1e293b/00f3ff?text=Image+Placeholder";
                  }}
                />
              )}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevLightbox();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md p-3 rounded-full text-white transition-all"
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextLightbox();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md p-3 rounded-full text-white transition-all"
                    aria-label="Next media"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-mono">
                {lightboxIndex + 1} / {displayImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};