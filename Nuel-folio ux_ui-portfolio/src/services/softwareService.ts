/**
 * Software Service Utilities
 * 
 * This file contains utility functions for managing software products
 * and fetching data from Supabase database and storage.
 */

import { supabase, isSupabaseConfigured } from '../supabase';

export interface SoftwareProduct {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  price: string;
  duration?: string;
}

/**
 * Database interface for software_products table
 */
interface SoftwareProductRow {
  id: string;
  name: string;
  price: number;
  description: string | null;
  duration: string | null;
  image_filename: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

/**
 * Fetches all active software products from Supabase database
 * and generates public URLs for their images from storage
 * @returns Promise<SoftwareProduct[]> Array of software products
 */
export const fetchSoftwareProducts = async (): Promise<SoftwareProduct[]> => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please configure your environment variables.');
  }

  try {
    // Fetch products from database table
    const { data: products, error: dbError } = await supabase
      .from('software_products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (dbError) {
      throw new Error(`Failed to fetch products from database: ${dbError.message}`);
    }

    if (!products || products.length === 0) {
      console.warn('No active products found in software_products table.');
      return [];
    }

    // Map database rows to SoftwareProduct interface and generate image URLs
    const productList: SoftwareProduct[] = products.map((row: SoftwareProductRow) => {
      // Generate public URL from image_filename
      // Path format: services/filename.jpg -> projects/services/filename.jpg
      const imagePath = `services/${row.image_filename}`;
      const { data: urlData } = supabase.storage
        .from('projects')
        .getPublicUrl(imagePath);

      console.log(`[SoftwareService] Product: ${row.name}, Image path: ${imagePath}, URL: ${urlData.publicUrl}`);

      // Format price with currency symbol
      const formattedPrice = `$${parseFloat(row.price.toString()).toFixed(2)}`;

      return {
        id: row.id,
        name: row.name,
        imageUrl: urlData.publicUrl,
        description: row.description || undefined,
        price: formattedPrice,
        duration: row.duration || undefined
      };
    });

    return productList;
  } catch (error) {
    console.error('Error fetching software products:', error);
    throw error;
  }
};

/**
 * Formats price and duration for display
 * @param price Price string (e.g., "$25.00")
 * @param duration Duration string (e.g., "4 Months")
 * @returns Formatted string (e.g., "$25.00 / 4 Months")
 */
export const formatPriceDuration = (price: string, duration?: string): string => {
  if (duration) {
    return `${price} / ${duration}`;
  }
  return price;
};
