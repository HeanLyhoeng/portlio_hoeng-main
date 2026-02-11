/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client using your project credentials.
 * 
 * SECURITY NOTES:
 * - We use the ANON (anonymous) key, which is safe to expose in frontend code
 * - The anon key is limited by Row Level Security (RLS) policies
 * - NEVER use the service_role key in frontend code (it bypasses RLS)
 * 
 * SETUP:
 * 1. Get your Supabase URL and anon key from: https://app.supabase.com
 * 2. Go to: Project Settings > API
 * 3. Copy "Project URL" and "anon public" key
 * 4. Add them to your .env file (see rootproject.env)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * We don't want the whole app to crash when Supabase isn't configured yet.
 * Instead, expose a flag and a nullable client so the UI can gracefully fall
 * back to static content and keep working locally.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables are missing. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live data.'
  );
}

// Type definitions for our projects table
export interface Project {
  id: string;
  title: string;
  category: string;
  video_url: string | null;
  image_url: string;
  created_at: string;
}

// Helper type for inserting new projects (without id and created_at)
export interface ProjectInsert {
  title: string;
  category: string;
  video_url?: string | null;
  image_url: string;
}
