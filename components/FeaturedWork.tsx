import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from './ui/SectionHeading';
import { supabase, Project, isSupabaseConfigured } from '../Nuel-folio ux_ui-portfolio/src/supabase';

// Interface for component's project format (adapted from Supabase schema)
interface ProjectDisplay {
	id: string;
	title: string;
	category: string;
	video: string;
	fallbackImage: string;
}

// Helper function to check if URL is a video file
const isVideoURL = (url: string): boolean => {
	return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.mov');
};

// Helper function to check if URL is an image file
const isImageURL = (url: string): boolean => {
	const lowerUrl = url.toLowerCase();
	return lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg') || lowerUrl.endsWith('.png') || lowerUrl.endsWith('.gif') || lowerUrl.endsWith('.webp');
};

export const FeaturedWork: React.FC = () => {
	const [projects, setProjects] = useState<ProjectDisplay[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Local sample data shown when Supabase isn't configured (deprecated - should use Supabase)
	const fallbackProjects: ProjectDisplay[] = [
		{
			id: 'sample-1',
			title: 'Sample Project',
			category: 'PORTFOLIO',
			video: '',
			fallbackImage: '/img/Work/Graphic/01.jpg'
		},
	];

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setLoading(true);
				setError(null);

				// If Supabase isn't configured locally, show sample data instead of crashing
				if (!isSupabaseConfigured || !supabase) {
					setProjects(fallbackProjects);
					setError('Supabase env vars missing. Showing sample projects.');
					return;
				}

				// Query Supabase 'projects' table ordered by creation date (newest first)
				const { data, error: fetchError } = await supabase
					.from('projects')
					.select('id, title, category, image_url, video_url, created_at')
					.order('created_at', { ascending: false })
					.limit(12);

				if (fetchError) {
					throw fetchError;
				}

				// Transform Supabase data to component format
				const fetchedProjects: ProjectDisplay[] = (data || []).map((project: Project) => ({
					id: project.id,
					title: project.title,
					category: project.category,
					video: project.video_url || project.image_url || '', // Use video_url if available, otherwise image_url
					fallbackImage: project.image_url || '', // Always use image_url from database as fallback
				}));

				setProjects(fetchedProjects);
			} catch (err) {
				console.error('Error fetching projects:', err);
				setError('Failed to load projects. Showing sample data.');
				// Fallback to sample data on error
				setProjects(fallbackProjects);
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();
	}, []);

	return (
		<section
			id="work"
			className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 sm:px-6"
		>
			<div className="mb-8 md:mb-12">
				<SectionHeading
					title="Explore My Work"
					subtitle=""
					subtitleColor="white"
					titleColor="white"
				/>
			</div>

			{loading && (
				<div className="flex items-center justify-center py-20">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neon-primary border-t-transparent mb-4"></div>
						<p className="text-slate-400 text-sm">Loading projects...</p>
					</div>
				</div>
			)}

			{error && (
				<div className="flex items-center justify-center py-20">
					<div className="text-center">
						<p className="text-red-400 mb-2">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-neon-primary text-black rounded-lg font-mono font-bold text-sm hover:bg-white transition-colors"
						>
							Retry
						</button>
					</div>
				</div>
			)}

			{!loading && !error && projects.length === 0 && (
				<div className="flex items-center justify-center py-20">
					<p className="text-slate-400">No projects found. Add your first project using the admin panel.</p>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
				{projects.map((project, i) => (
					<motion.div
						key={project.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: i * 0.1 }}
						className="group cursor-pointer"
						onClick={() => {
							window.location.hash = `/project/${project.id}`;
						}}
					>
						{/* Poster-Style Project Card */}
						<div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-3 border border-white/10 group-hover:border-neon-primary/50 transition-all shadow-lg group-hover:shadow-xl">
							{/* Background with Light Blue Gradient */}
							<div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-blue-50 to-white z-0">
								{/* Shimmer/Bokeh Effects using Blurred Circles */}
								<div className="absolute inset-0 opacity-40">
									<div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
									<div className="absolute top-32 right-16 w-24 h-24 bg-cyan-200 rounded-full blur-2xl"></div>
									<div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-100 rounded-full blur-3xl"></div>
									<div className="absolute top-1/2 right-1/4 w-28 h-28 bg-cyan-100 rounded-full blur-2xl"></div>
								</div>
							</div>

							{/* Image from database (image_url) as Subtle Background (20% opacity) */}
							<div className="absolute inset-0 z-[1] opacity-20 group-hover:opacity-30 transition-opacity duration-300">
								{project.fallbackImage ? (
									<img
										src={project.fallbackImage}
										alt={project.title}
										className="w-full h-full object-cover"
										loading="lazy"
										decoding="async"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect fill="%231a1a2e" width="400" height="600"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Not Found%3C/text%3E%3C/svg%3E';
										}}
									/>
								) : project.video && isVideoURL(project.video) ? (
									<video
										src={project.video}
										className="w-full h-full object-cover"
										autoPlay
										loop
										muted
										playsInline
										onError={(e) => {
											// Video failed, but we don't have a fallback image
											const videoElement = e.target as HTMLVideoElement;
											videoElement.style.display = 'none';
										}}
									/>
								) : null}
							</div>

							{/* Logo/Branding Element (Top Center) */}
							<div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
								<div className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
									<span className="text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
										{project.category}
									</span>
								</div>
							</div>

							{/* Project Title Overlay - Large, Bold, Uppercase, Centered, Blue-to-Cyan Gradient */}
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center px-4">
								<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight" style={{
									background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									fontFamily: 'sans-serif'
								}}>
									{project.title.split('–')[0].trim().toUpperCase()}
								</h3>
							</div>

							{/* Footer Details - Bottom Edge with "View Details" and "Explore" Icons */}
							<div className="absolute bottom-2 left-0 right-0 px-4 flex justify-between items-center text-[10px] text-blue-700 font-medium z-10">
								<span className="flex items-center gap-1">
									<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
									</svg>
									View Details
								</span>
								<span className="flex items-center gap-1">
									<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
										<path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 2.5 10 2.5c4.478 0 8.268 3.443 9.542 7.5-1.274 4.057-5.064 7.5-9.542 7.5-4.478 0-8.268-3.443-9.542-7.5zM10 4a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd" />
									</svg>
									Explore
								</span>
							</div>

							{/* Hover Effects with Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2]" />
						</div>

						{/* Project Title Below Card */}
						<p className="text-white text-sm font-medium text-center group-hover:text-blue-gradient transition-colors line-clamp-2">
							{project.title}
						</p>
					</motion.div>
				))}
			</div>
		</section>
	);
};