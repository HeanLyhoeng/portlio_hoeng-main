/**
 * Upload image to Supabase 'projects' storage bucket using environment variables
 * 
 * Usage:
 *   node scripts/uploadImageToProjects.js ./path/to/image.png
 * 
 * This script uses environment variables from rootproject.env:
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, statSync } from 'fs';
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
  console.error('\n   Current values:');
  console.error(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.error(`   VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadImageToProjects(imagePath, customFileName = null) {
  try {
    // Check if file exists
    if (!existsSync(imagePath)) {
      console.error(`❌ Error: File not found: ${imagePath}`);
      process.exit(1);
    }

    console.log(`📖 Reading image file: ${imagePath}`);
    
    // Read the file
    const fileBuffer = readFileSync(imagePath);
    const fileName = customFileName || basename(imagePath);
    
    // Get file stats for info
    const stats = statSync(imagePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`   File size: ${fileSizeMB} MB`);
    console.log(`   Target filename: ${fileName}`);
    
    // Create a File-like object for Supabase
    const file = new File([fileBuffer], fileName, {
      type: getMimeType(imagePath),
    });

    console.log(`📤 Uploading to Supabase storage bucket 'projects'...`);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('projects')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // Set to true if you want to overwrite existing files
      });

    if (error) {
      // Check if it's a conflict (file already exists)
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        console.error(`❌ Error: File '${fileName}' already exists in the bucket`);
        console.error('   Tip: Delete the existing file first, or modify the script to use upsert: true');
      } else if (error.message.includes('Bucket not found')) {
        console.error(`❌ Error: Bucket 'projects' not found`);
        console.error('\n💡 Tip: Make sure you have created the "projects" bucket in Supabase.');
        console.error('   Run the migration: supabase/migrations/20260113044123_create_storage_bucket.sql');
      } else {
        throw error;
      }
      process.exit(1);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('projects')
      .getPublicUrl(data.path);

    console.log(`✅ Successfully uploaded image!`);
    console.log(`   Path: ${data.path}`);
    console.log(`   Full Path: ${data.fullPath}`);
    console.log(`   Public URL: ${publicUrlData.publicUrl}`);

    return {
      path: data.path,
      fullPath: data.fullPath,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error('❌ Error uploading image:', error.message);
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
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

// Get image path from command line arguments
const imagePath = process.argv[2];
const customFileName = process.argv[3]; // Optional custom filename

if (!imagePath) {
  console.error('❌ Error: Please provide an image file path');
  console.error('   Usage: node scripts/uploadImageToProjects.js ./path/to/image.png [custom-filename.png]');
  process.exit(1);
}

uploadImageToProjects(imagePath, customFileName);
