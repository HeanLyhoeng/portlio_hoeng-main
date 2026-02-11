import React, { useState } from 'react';
import { supabase, ProjectInsert, isSupabaseConfigured } from '../Nuel-folio ux_ui-portfolio/src/supabase';

export const AdminUpload: React.FC = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('VIDEO EDITING');
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabaseReady = isSupabaseConfigured && Boolean(supabase);

    /**
     * Validates the file before upload
     * - Checks file size (max 5MB)
     * - Checks file type (images and videos only)
     */
    const validateFile = (file: File): string | null => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return `File size exceeds 5MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`;
        }

        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/webm', 'video/mov', 'video/quicktime'
        ];

        if (!allowedTypes.includes(file.type)) {
            return `File type not allowed. Please upload an image or video file.`;
        }

        return null;
    };

    /**
     * Generates a unique filename to avoid conflicts
     */
    const generateFileName = (file: File): string => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 9);
        const extension = file.name.split('.').pop();
        return `${timestamp}-${randomString}.${extension}`;
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!supabaseReady || !supabase) {
            setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable uploads.');
            return;
        }

        // Validation
        if (!title.trim()) {
            setError('Please enter a project title');
            return;
        }

        if (!file && !videoUrl.trim()) {
            setError('Please upload an image file or provide a video URL');
            return;
        }

        // If file is provided, validate it
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setUploading(true);

        try {
            let imageUrl = '';

            // Step 1: Upload file to Supabase Storage (if provided)
            if (file) {
                const fileName = generateFileName(file);
                const filePath = `${fileName}`;

                // Upload to Supabase Storage bucket 'projects'
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('projects')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false // Don't overwrite existing files
                    });

                if (uploadError) {
                    throw new Error(`Upload failed: ${uploadError.message}`);
                }

                // Get public URL of the uploaded file
                const { data: urlData } = supabase.storage
                    .from('projects')
                    .getPublicUrl(filePath);

                imageUrl = urlData.publicUrl;
            } else if (videoUrl.trim()) {
                // If no file but video URL provided, use video URL as image URL
                imageUrl = videoUrl.trim();
            }

            // Step 2: Insert project data into Supabase database
            const projectData: ProjectInsert = {
                title: title.trim(),
                category: category,
                image_url: imageUrl,
                video_url: videoUrl.trim() || null
            };

            const { error: insertError } = await supabase
                .from('projects')
                .insert([projectData]);

            if (insertError) {
                throw new Error(`Database error: ${insertError.message}`);
            }

            // Success!
            setSuccess(true);
            setTitle('');
            setCategory('VIDEO EDITING');
            setVideoUrl('');
            setFile(null);

            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Error uploading project. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-slate-200 py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-blue-gradient">Add New Project</h2>
                    <p className="text-slate-400 text-sm">Upload your project to Supabase Storage and Database</p>
                </div>

                {!supabaseReady && (
                    <div className="mb-4 p-4 rounded-lg bg-blue-900/20 border border-blue-500/50 text-sm text-blue-200">
                        Supabase environment variables are missing. Add <code className="font-mono">VITE_SUPABASE_URL</code> and <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in a <code className="font-mono">.env</code> file at the project root to enable uploads. The form is disabled until then.
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6 bg-dark-card p-6 sm:p-8 rounded-xl border border-white/10 shadow-lg">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300">
                            Project Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 rounded-lg bg-dark-surface border border-white/10 focus:border-neon-primary focus:ring-1 focus:ring-neon-primary/50 outline-none text-white placeholder:text-slate-500 transition-all"
                            placeholder="e.g., Solara – Smart Home Launch Video"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 rounded-lg bg-dark-surface border border-white/10 focus:border-neon-primary focus:ring-1 focus:ring-neon-primary/50 outline-none text-white transition-all"
                        >
                            <option value="VIDEO EDITING" className="bg-dark-card">VIDEO EDITING</option>
                            <option value="WEB DESIGN" className="bg-dark-card">WEB DESIGN</option>
                            <option value="GRAPHIC DESIGN" className="bg-dark-card">GRAPHIC DESIGN</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300">
                            Video URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="w-full p-3 rounded-lg bg-dark-surface border border-white/10 focus:border-neon-primary focus:ring-1 focus:ring-neon-primary/50 outline-none text-white placeholder:text-slate-500 transition-all"
                            placeholder="https://example.com/video.mp4 (optional)"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            If you have a video hosted elsewhere, paste the URL here. Otherwise, upload an image below.
                        </p>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300">
                            Upload Image (Required if no video URL)
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                className="w-full text-sm text-slate-400 
                                    file:mr-4 file:py-2.5 file:px-4 
                                    file:rounded-lg file:border-0 
                                    file:bg-neon-primary file:text-black 
                                    file:font-mono file:font-bold file:text-xs
                                    hover:file:bg-white hover:file:shadow-[0_0_20px_rgba(0,243,255,0.6)]
                                    file:transition-all file:cursor-pointer
                                    cursor-pointer"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            />
                        </div>
                        {file && (
                            <p className="mt-2 text-xs text-slate-500">
                                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                        {file && (
                            <p className="mt-1 text-xs text-slate-400">
                                Max file size: 5MB. Supported: JPEG, PNG, GIF, WebP
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/50">
                            <p className="text-red-400 text-sm font-medium">Error: {error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/50">
                            <p className="text-green-400 text-sm font-medium">✓ Project uploaded successfully!</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={uploading || !supabaseReady}
                        className={`w-full py-3.5 rounded-lg font-mono font-bold uppercase tracking-wider text-sm transition-all duration-300 ${uploading || !supabaseReady
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-neon-primary text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]'
                            }`}
                    >
                        {uploading ? 'Uploading...' : supabaseReady ? 'Publish Project' : 'Waiting for Supabase'}
                    </button>
                </form>
            </div>
        </div>
    );
};