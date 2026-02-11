/**
 * Sync projects from storage folders to database
 * 
 * This script:
 * 1. Lists all project folders in the 'projects' storage bucket
 * 2. Creates or updates project entries in the database
 * 3. Links the first image from each folder to the project
 * 4. Specifically recognizes solara, orbitpay, and nanobot folders
 * 
 * Usage:
 *   node scripts/syncProjectsFromStorage.js
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Project configuration mapping folder names to project details
 */
const PROJECT_CONFIG = {
  solara: {
    title: 'Solara – Smart Home Launch Video',
    category: 'VIDEO EDITING',
  },
  orbitpay: {
    title: 'OrbitPay – Corporate Web Presence',
    category: 'WEB DESIGN',
  },
  nanobot: {
    title: 'Nanobot 3D Mascot & Motion',
    category: 'GRAPHIC DESIGN', // or 'MOTION' if preferred
  },
};

/**
 * Get project configuration for a folder name
 */
function getProjectConfig(folderName) {
  const lowerName = folderName.toLowerCase();
  return PROJECT_CONFIG[lowerName] || {
    title: folderName.charAt(0).toUpperCase() + folderName.slice(1),
    category: 'PORTFOLIO',
  };
}

/**
 * Recursively list all files in storage
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
      if (error.message.includes('not found')) {
        return; // Folder doesn't exist, that's ok
      }
      console.warn(`Warning: Could not list ${path}: ${error.message}`);
      return;
    }

    for (const item of items || []) {
      const itemPath = path ? `${path}/${item.name}` : item.name;
      
      if (item.metadata || item.id) {
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
 * Check if a file is an image based on its extension
 */
function isImageFile(filePath) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const ext = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
  return imageExtensions.includes(ext);
}

/**
 * Get priority score for image file (lower = higher priority)
 * Prioritizes files like: 01.jpg, 1.jpg, image-1.jpg, etc.
 */
function getImagePriority(filePath) {
  const fileName = filePath.split('/').pop().toLowerCase();
  
  // Check for numbered patterns
  const patterns = [
    /^0?1\.(jpg|jpeg|png|gif|webp)$/,  // 01.jpg, 1.jpg
    /^image-?0?1\.(jpg|jpeg|png|gif|webp)$/i,  // image-01.jpg, image-1.jpg, image01.jpg
    /^01\.(jpg|jpeg|png|gif|webp)$/,  // explicit 01
    /^1\.(jpg|jpeg|png|gif|webp)$/,   // explicit 1
    /^preview\.(jpg|jpeg|png|gif|webp)$/i,  // preview.jpg
    /^main\.(jpg|jpeg|png|gif|webp)$/i,    // main.jpg
  ];
  
  for (let i = 0; i < patterns.length; i++) {
    if (patterns[i].test(fileName)) {
      return i; // Lower index = higher priority
    }
  }
  
  // Default priority for other files (will be sorted alphabetically)
  return 100 + fileName.charCodeAt(0);
}

/**
 * Sort images to prioritize numbered files (01.jpg, 1.jpg, etc.)
 */
function sortImages(images) {
  return images.sort((a, b) => {
    const priorityA = getImagePriority(a);
    const priorityB = getImagePriority(b);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    // If same priority, sort alphabetically
    return a.localeCompare(b);
  });
}

/**
 * Get images organized by project folder
 * Specifically looks for solara, orbitpay, and nanobot folders
 */
async function getProjectsFromStorage() {
  console.log('📂 Scanning storage bucket for project folders...');
  console.log('   Looking for: solara, orbitpay, nanobot\n');
  
  const allFiles = await listAllFilesInFolder();
  
  // Organize files by project folder (filter for images only)
  const projects = {};
  
  // Priority folders to recognize
  const priorityFolders = ['solara', 'orbitpay', 'nanobot'];
  
  allFiles.forEach((filePath) => {
    // Only process image files
    if (!isImageFile(filePath)) {
      return;
    }
    
    const parts = filePath.split('/');
    
    if (parts.length === 1) {
      // File in root - skip or handle separately
      return;
    }
    
    // File in a project folder
    const projectFolderName = parts[0].toLowerCase();
    const projectName = priorityFolders.includes(projectFolderName) 
      ? projectFolderName 
      : parts[0];
    
    if (!projects[projectName]) {
      projects[projectName] = [];
    }
    projects[projectName].push(filePath);
  });

  // Sort images in each project folder (prioritize numbered files)
  Object.keys(projects).forEach(key => {
    projects[key] = sortImages(projects[key]);
  });

  // Prioritize the three specific folders
  const priorityProjects = {};
  priorityFolders.forEach(folder => {
    if (projects[folder]) {
      priorityProjects[folder] = projects[folder];
    }
  });

  // Add other folders if any
  Object.keys(projects).forEach(key => {
    if (!priorityFolders.includes(key.toLowerCase())) {
      priorityProjects[key] = projects[key];
    }
  });

  return priorityProjects;
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
 * Sync projects from storage to database
 */
async function syncProjectsFromStorage() {
  try {
    // Get projects from storage
    const storageProjects = await getProjectsFromStorage();
    const projectNames = Object.keys(storageProjects).filter(name => name !== 'root');

    if (projectNames.length === 0) {
      console.log('⚠️  No project folders found in storage bucket.');
      console.log('   Expected structure: projects/project-name/image.jpg');
      process.exit(0);
    }

    console.log(`\n📁 Found ${projectNames.length} project folder(s) in storage:\n`);
    projectNames.forEach(name => {
      const config = getProjectConfig(name);
      const isPriority = ['solara', 'orbitpay', 'nanobot'].includes(name.toLowerCase());
      const marker = isPriority ? '⭐' : '  ';
      console.log(`   ${marker} ${name}: ${storageProjects[name].length} image(s) → "${config.title}" (${config.category})`);
    });
    console.log('');

    // Get existing projects from database
    const { data: existingProjects, error: fetchError } = await supabase
      .from('projects')
      .select('id, title, image_url');

    if (fetchError) {
      throw new Error(`Failed to fetch existing projects: ${fetchError.message}`);
    }

    const existingTitles = new Set((existingProjects || []).map(p => p.title.toLowerCase()));

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Process each project folder
    for (const projectFolderName of projectNames) {
      const images = storageProjects[projectFolderName];
      if (images.length === 0) {
        console.log(`⚠️  Skipping "${projectFolderName}" (no images found)`);
        continue;
      }

      // Use the first image (prioritized - e.g., 01.jpg) as the project image
      // Images are already sorted by priority (numbered files first)
      const firstImage = images[0];
      const imageUrl = getImagePublicUrl(firstImage);
      
      console.log(`\n📸 Processing "${projectFolderName}":`);
      console.log(`   Selected image: ${firstImage.split('/').pop()}`);

      // Get project configuration (title and category) based on folder name
      const projectConfig = getProjectConfig(projectFolderName);
      const projectTitle = projectConfig.title;
      const projectCategory = projectConfig.category;

      // Check if project already exists (by title match, case-insensitive)
      const existingProject = (existingProjects || []).find(
        p => p.title.toLowerCase() === projectTitle.toLowerCase()
      );

      if (existingProject) {
        // Update existing project's image_url column
        const needsUpdate = existingProject.image_url !== imageUrl;
        
        if (needsUpdate) {
          const updateData = { image_url: imageUrl };
          
          const { error: updateError } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', existingProject.id);

          if (updateError) {
            console.error(`   ❌ Failed to update image_url: ${updateError.message}`);
          } else {
            updatedCount++;
            console.log(`   ✅ Updated image_url column for "${projectTitle}"`);
            console.log(`      Category: ${projectCategory}`);
            console.log(`      Image URL: ${imageUrl}`);
          }
        } else {
          skippedCount++;
          console.log(`   ⏭️  Skipped "${projectTitle}" (image_url already up to date)`);
        }
      } else {
        // Create new project with proper title, category, and image_url
        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert({
            title: projectTitle,
            category: projectCategory,
            image_url: imageUrl, // Save the first image URL to image_url column
          })
          .select()
          .single();

        if (insertError) {
          console.error(`   ❌ Failed to create project: ${insertError.message}`);
        } else {
          createdCount++;
          console.log(`   ✅ Created project "${projectTitle}"`);
          console.log(`      Folder: ${projectFolderName}`);
          console.log(`      Category: ${projectCategory}`);
          console.log(`      ID: ${newProject.id}`);
          console.log(`      Image URL saved to image_url column: ${imageUrl}`);
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📋 Sync Summary:');
    console.log(`   Projects in storage: ${projectNames.length}`);
    console.log(`   ✅ Created: ${createdCount}`);
    console.log(`   🔄 Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log('='.repeat(70));

    return { success: true, created: createdCount, updated: updatedCount };
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncProjectsFromStorage();
