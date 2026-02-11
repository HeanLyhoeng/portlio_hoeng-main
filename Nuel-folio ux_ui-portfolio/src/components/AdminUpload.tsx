import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const AdminUpload: React.FC = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('VIDEO EDITING');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a video or image file!");
            return;
        }

        setUploading(true);
        try {
            // 1. Upload File to Firebase Storage
            const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(uploadTask.ref);

            // 2. Save metadata to Firestore
            await addDoc(collection(db, "projects"), {
                title: title,
                category: category,
                videoURL: downloadURL, // Video/Image URL from Storage
                fallbackImage: downloadURL, // Can use the same URL as fallback
                createdAt: new Date(),
                updatedAt: new Date()
            });

            alert("Project uploaded successfully!");
            setTitle('');
            setCategory('VIDEO EDITING');
            setFile(null);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading project. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-slate-200 py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gold-gradient">Add New Project</h2>
                    <p className="text-slate-400 text-sm">Upload your project to Firebase Storage and Firestore</p>
                </div>
                
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
                            Upload Media (Video or Image)
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
                                accept="video/*,image/*" 
                                required
                            />
                        </div>
                        {file && (
                            <p className="mt-2 text-xs text-slate-500">
                                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={uploading}
                        className={`w-full py-3.5 rounded-lg font-mono font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
                            uploading 
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                : 'bg-neon-primary text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]'
                        }`}
                    >
                        {uploading ? 'Uploading...' : 'Publish Project'}
                    </button>
                </form>
            </div>
        </div>
    );
};
