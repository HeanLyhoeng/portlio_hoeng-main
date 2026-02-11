/**
 * Hero Service Utilities
 * 
 * Fetches hero content from Supabase hero_content table
 */

import { supabase, isSupabaseConfigured } from '../supabase';

export interface HeroContent {
  id: string;
  hero_title: string;
  hero_description: string;
  hero_button_text: string;
}

/**
 * Fetches hero content from Supabase
 * @returns Promise<HeroContent | null> Hero content or null if not found
 */
export const fetchHeroContent = async (): Promise<HeroContent | null> => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Using fallback hero content.');
    return null;
  }

  try {
    // Simple fetch - basic select query only
    const { data, error } = await supabase
      .from('hero_content')
      .select('*');

    if (error) {
      console.error('Error fetching hero content:', error);
      console.error('Error details:', { message: error.message, details: error.details, hint: error.hint });
      return null;
    }

    // If data exists, return the first record; otherwise return null
    if (data && data.length > 0) {
      console.log('Fetched Hero Content:', data[0]);
      return data[0] as HeroContent;
    }

    console.warn('No hero content found in database');
    return null;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
};
