import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Facebook, Youtube, MessageCircle, Share2, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const PortfolioCategories: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { name: formData.name, email: formData.email, message: formData.message }
        ]);

      if (error) throw error;
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

        {/* LEFT COLUMN: Header + Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Me</h2>
            <p className="text-zinc-400 text-lg">Got a project? Chat to me for a friendly consultation.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                placeholder="Message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  Send Message
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-green-400 text-sm mt-2"
                >
                  Thanks! I'll be in touch soon.
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  Failed to send. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* RIGHT COLUMN: Contact Details List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-12 lg:pl-12"
        >
          {/* --- Item 1: Telegram --- */}
          <div className="flex gap-6 group">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white/20 transition-colors">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Chat on Telegram</h3>
              <p className="text-zinc-400 text-sm mb-3">Fastest response time.</p>
              <a
                href="https://t.me/Hean_Lyhoeng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:text-cyan-400 hover:underline flex items-center gap-2 transition-all group-hover:gap-3"
              >
                Start a chat <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* --- Item 2: Email --- */}
          <div className="flex gap-6 group">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white/20 transition-colors">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Email Me</h3>
              <p className="text-zinc-400 text-sm mb-3">For project details & files.</p>
              <a
                href="mailto:lyhoenghean24@gmail.com"
                className="text-white font-semibold hover:text-purple-400 hover:underline break-all"
              >
                lyhoenghean24@gmail.com
              </a>
            </div>
          </div>

          {/* --- Item 3: Social Media --- */}
          <div className="flex gap-6 group">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white/20 transition-colors">
              <Share2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Follow my work</h3>
              <p className="text-zinc-400 text-sm mb-3">Check out my latest updates.</p>

              <div className="flex flex-wrap gap-4">
                {/* Facebook */}
                <a href="https://web.facebook.com/lyhoeng.hean/" target="_blank" className="text-zinc-300 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
                {/* YouTube */}
                <a href="https://www.youtube.com/@T3MovieUniverse" target="_blank" className="text-zinc-300 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
                  <Youtube className="w-4 h-4" /> YouTube
                </a>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};