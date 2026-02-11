
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase, Project, isSupabaseConfigured } from './Nuel-folio ux_ui-portfolio/src/supabase';

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setProject(data);
        } else {
          setError('Project not found');
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neon-primary border-t-transparent mb-4"></div>
        <p className="text-slate-400 text-sm">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Project Not Found</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <button className="px-4 py-2 bg-neon-primary text-white rounded" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // Helper to get services from category
  const getServices = (category: string) => {
    const serviceMap = {
      'VIDEO EDITING': ['Video Editing', 'Motion Graphics', 'Sound Design'],
      'WEB DESIGN': ['Web Development', 'UI/UX Design', 'Fintech Branding'],
      'GRAPHIC DESIGN': ['Data Visualization', 'Social Media', 'Infographics', 'Graphic Design'],
    };
    return serviceMap[category] || ['Design', 'Portfolio'];
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-20 px-4 sm:px-6"
    >
      <div className="max-w-2xl mx-auto bg-slate-900 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gold-gradient">{project.title}</h2>
        <p className="mb-6 text-slate-300">{project.description}</p>
        <div className="mb-6">
          <strong>Category:</strong> {project.category}
        </div>
        <div className="mb-6">
          <strong>Services:</strong> {getServices(project.category).join(', ')}
        </div>
        <div className="mb-6">
          {project.video_url ? (
            <video
              src={project.video_url}
              className="w-full h-64 object-cover rounded"
              autoPlay
              loop
              muted
              playsInline
              onError={e => {
                const videoElement = e.target;
                const img = document.createElement('img');
                img.src = project.image_url;
                img.className = videoElement.className;
                img.alt = project.title;
                videoElement.parentNode?.replaceChild(img, videoElement);
              }}
            />
          ) : (
            <img 
  src={project.image_url} 
  alt={project.title} 
  className="w-full h-auto rounded-lg shadow-lg"
              onError={e => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450/1e293b/00f3ff?text=No+Image';
              }}
            />
          )}
        </div>
        <button className="px-4 py-2 bg-neon-primary text-white rounded" onClick={() => navigate(-1)}>
          Back to Work
        </button>
      </div>
    </motion.section>
  );
}
