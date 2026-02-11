/**
 * Upload image to Supabase 'images' storage bucket
 * 
 * Usage:
 *   node scripts/uploadImageToImages.js ./assets/my-photo.png
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', 'rootproject.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials in rootproject.env');
  console.error('   Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadImageToImages(imagePath) {
  try {
    // Check if file exists
    if (!existsSync(imagePath)) {
      console.error(`❌ Error: File not found: ${imagePath}`);
      process.exit(1);
    }

    console.log(`📖 Reading image file: ${imagePath}`);
    
    // Read the file
    const fileBuffer = readFileSync(imagePath);
    const fileName = basename(imagePath);
    
    // Create a File-like object for Supabase
    const file = new File([fileBuffer], fileName, {
      type: getMimeType(imagePath),
    });

    console.log(`📤 Uploading to Supabase storage bucket 'images'...`);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // Set to true if you want to overwrite existing files
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    console.log(`✅ Successfully uploaded image!`);
    console.log(`   Path: ${data.path}`);
    console.log(`   Public URL: ${publicUrlData.publicUrl}`);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error('❌ Error uploading image:', error.message);
    
    if (error.message.includes('Bucket not found')) {
      console.error('\n💡 Tip: Make sure you have created the "images" bucket in Supabase.');
      console.error('   Run the migration: supabase/migrations/20260114000001_create_images_storage_bucket.sql');
    }
    
    process.exit(1);
  }
}

function getMimeType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

// Get image path from command line arguments
const imagePath = process.argv[2];

if (!imagePath) {
  console.error('❌ Error: Please provide an image file path');
  console.error('   Usage: node scripts/uploadImageToImages.js ./assets/my-photo.png');
  process.exit(1);
}

uploadImageToImages(imagePath);
