/**
 * Update projects table with image URLs from Supabase storage
 * 
 * This script:
 * 1. Fetches all projects from the database
 * 2. Lists images in the 'projects' storage bucket organized by project folder
 * 3. Updates each project's image_url field with the first image from its folder
 * 
 * Usage:
 *   node scripts/updateProjectsWithImages.js
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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

/**
 * Get all files from the projects bucket, organized by project folder
 */
async function getImagesByProject() {
  console.log('📂 Fetching images from Supabase storage...');
  
  const { data: files, error } = await supabase.storage
    .from('projects')
    .list('', {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  // Organize files by project folder
  const projectImages = {};
  
  files.forEach((file) => {
    // Skip folders (they have no name or are directories)
    if (file.name) {
      const parts = file.name.split('/');
      
      if (parts.length === 1) {
        // File in root of bucket
        if (!projectImages['root']) {
          projectImages['root'] = [];
        }
        projectImages['root'].push(file.name);
      } else {
        // File in a project folder (e.g., "solara/image1.jpg")
        const projectName = parts[0];
        if (!projectImages[projectName]) {
          projectImages[projectName] = [];
        }
        projectImages[projectName].push(file.name);
      }
    }
  });

  return projectImages;
}

/**
 * Recursively list all files in a folder path
 */
async function listAllFilesInFolder(folderPath = '') {
  const allFiles = [];
  
  async function listRecursive(path) {
    const { data: items, error } = await supabase.storage
      .from('projects')
      .list(path, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.warn(`Warning: Could not list ${path}: ${error.message}`);
      return;
    }

    for (const item of items || []) {
      const itemPath = path ? `${path}/${item.name}` : item.name;
      
      if (item.metadata) {
        // It's a file
        allFiles.push(itemPath);
      } else {
        // It's a folder, recurse into it
        await listRecursive(itemPath);
      }
    }
  }

  await listRecursive(folderPath);
  return allFiles;
}

/**
 * Get images organized by project folder (supports nested folders)
 */
async function getImagesByProjectRecursive() {
  console.log('📂 Fetching all images from Supabase storage...');
  
  const allFiles = await listAllFilesInFolder();
  
  // Organize files by project folder
  const projectImages = {};
  
  allFiles.forEach((filePath) => {
    const parts = filePath.split('/');
    
    if (parts.length === 1) {
      // File in root
      if (!projectImages['root']) {
        projectImages['root'] = [];
      }
      projectImages['root'].push(filePath);
    } else {
      // File in a project folder
      const projectName = parts[0];
      if (!projectImages[projectName]) {
        projectImages[projectName] = [];
      }
      projectImages[projectName].push(filePath);
    }
  });

  return projectImages;
}

/**
 * Get public URL for an image
 */
function getImagePublicUrl(imagePath) {
  const { data } = supabase.storage
    .from('projects')
    .getPublicUrl(imagePath);
  return data.publicUrl;
}

/**
 * Match project by title (case-insensitive, flexible matching)
 */
function matchProjectTitle(projectTitle, folderName) {
  // Normalize both strings
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalize(projectTitle) === normalize(folderName);
}

/**
 * Update projects with image URLs
 */
async function updateProjectsWithImages() {
  try {
    // Step 1: Get all projects from database
    console.log('📋 Fetching projects from database...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, category, image_url')
      .order('title');

    if (projectsError) {
      throw new Error(`Failed to fetch projects: ${projectsError.message}`);
    }

    if (!projects || projects.length === 0) {
      console.log('⚠️  No projects found in the database.');
      console.log('   Please add projects to your database first.');
      process.exit(0);
    }

    console.log(`✅ Found ${projects.length} project(s) in database\n`);

    // Step 2: Get all images from storage organized by project folder
    const projectImages = await getImagesByProjectRecursive();
    
    const projectFolders = Object.keys(projectImages);
    console.log(`📁 Found ${projectFolders.length} project folder(s) in storage:`);
    projectFolders.forEach(folder => {
      console.log(`   - ${folder}: ${projectImages[folder].length} image(s)`);
    });
    console.log('');

    // Step 3: Match projects with their folders and update
    let updatedCount = 0;
    let skippedCount = 0;
    const updates = [];

    for (const project of projects) {
      // Try to find matching folder
      let matchingFolder = null;
      
      // First, try exact match by title
      if (projectImages[project.title]) {
        matchingFolder = project.title;
      } else {
        // Try case-insensitive matching
        for (const folderName of projectFolders) {
          if (matchProjectTitle(project.title, folderName)) {
            matchingFolder = folderName;
            break;
          }
        }
      }

      if (matchingFolder && projectImages[matchingFolder].length > 0) {
        // Use the first image from the folder
        const firstImage = projectImages[matchingFolder][0];
        const imageUrl = getImagePublicUrl(firstImage);

        // Only update if the image_url is different
        if (project.image_url !== imageUrl) {
          const { error: updateError } = await supabase
            .from('projects')
            .update({ image_url: imageUrl })
            .eq('id', project.id);

          if (updateError) {
            console.error(`❌ Failed to update project "${project.title}": ${updateError.message}`);
          } else {
            updatedCount++;
            updates.push({
              project: project.title,
              oldUrl: project.image_url || '(none)',
              newUrl: imageUrl,
            });
            console.log(`✅ Updated "${project.title}"`);
            console.log(`   Image: ${firstImage}`);
            console.log(`   URL: ${imageUrl}`);
          }
        } else {
          skippedCount++;
          console.log(`⏭️  Skipped "${project.title}" (already has correct image URL)`);
        }
      } else {
        skippedCount++;
        console.log(`⚠️  No matching folder found for project "${project.title}"`);
        if (projectFolders.length > 0) {
          console.log(`   Available folders: ${projectFolders.join(', ')}`);
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📋 Update Summary:');
    console.log(`   Total projects: ${projects.length}`);
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log('='.repeat(70));

    if (updatedCount > 0) {
      console.log('\n✅ Updated projects:');
      updates.forEach((update, i) => {
        console.log(`   ${i + 1}. ${update.project}`);
        console.log(`      New URL: ${update.newUrl}`);
      });
    }

    return { success: true, updated: updatedCount, skipped: skippedCount };
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateProjectsWithImages();
