/**
 * Upload all images from /uploads folder to Supabase 'projects' storage bucket
 * 
 * Usage:
 *   node scripts/uploadAllImagesFromUploads.js
 * 
 * This script will:
 * 1. Scan sub-folders inside the /uploads directory
 * 2. Use the sub-folder name as the project folder name in Supabase 'projects' bucket
 * 3. Upload all images into their respective project folders (e.g., uploads/solara/* goes to projects/solara/)
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, extname, basename, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

/**
 * Get all image files organized by their sub-folder (project name)
 * Returns an object: { projectName: [filePath1, filePath2, ...] }
 */
function getImagesByProject(uploadsDir) {
  const projectImages = {};
  
  if (!existsSync(uploadsDir)) {
    return projectImages;
  }

  const entries = readdirSync(uploadsDir, { withFileTypes: true });

  entries.forEach((entry) => {
    const entryPath = join(uploadsDir, entry.name);

    if (entry.isDirectory()) {
      // This is a project folder
      const projectName = entry.name;
      projectImages[projectName] = [];

      // Find all images in this project folder
      function findImagesInDir(dir) {
        const files = readdirSync(dir);
        files.forEach((file) => {
          const filePath = join(dir, file);
          const stat = statSync(filePath);

          if (stat.isDirectory()) {
            // Recursively search subdirectories within the project folder
            findImagesInDir(filePath);
          } else if (imageExtensions.includes(extname(file).toLowerCase())) {
            projectImages[projectName].push(filePath);
          }
        });
      }

      findImagesInDir(entryPath);
    } else if (entry.isFile() && imageExtensions.includes(extname(entry.name).toLowerCase())) {
      // Image file directly in uploads folder (no project folder)
      // We'll handle this by putting it in a 'root' project or skipping it
      // For now, let's put it in a special 'root' folder
      if (!projectImages['root']) {
        projectImages['root'] = [];
      }
      projectImages['root'].push(entryPath);
    }
  });

  return projectImages;
}

async function uploadImage(filePath, projectName, uploadsDir) {
  try {
    const fileBuffer = readFileSync(filePath);
    const fileName = basename(filePath);
    
    // Get the relative path from the project folder to maintain subdirectory structure
    const projectDir = join(uploadsDir, projectName);
    const relativePath = relative(projectDir, filePath);
    
    // Construct the Supabase storage path: projectName/filename or projectName/subfolder/filename
    const storagePath = projectName === 'root' 
      ? fileName 
      : relativePath ? join(projectName, relativePath).replace(/\\/g, '/') : join(projectName, fileName);
    
    const file = new File([fileBuffer], fileName, {
      type: getMimeType(filePath),
    });

    const { data, error } = await supabase.storage
      .from('projects')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite if file already exists
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('projects')
      .getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      fileName: fileName,
      projectName: projectName,
      storagePath: storagePath,
    };
  } catch (error) {
    return {
      success: false,
      fileName: basename(filePath),
      projectName: projectName,
      error: error.message,
    };
  }
}

async function uploadAllImages() {
  const uploadsDir = join(__dirname, '..', 'uploads');

  console.log('🔍 Scanning for project folders in:', uploadsDir);
  console.log('');
  
  if (!existsSync(uploadsDir)) {
    console.log(`⚠️  Warning: Uploads directory not found: ${uploadsDir}`);
    console.log('   Please create the directory and add your project folders, then run this script again.');
    process.exit(0);
  }

  const projectImages = getImagesByProject(uploadsDir);
  const projectNames = Object.keys(projectImages);

  if (projectNames.length === 0) {
    console.log('⚠️  No project folders found in the uploads directory');
    console.log(`   Searched in: ${uploadsDir}`);
    console.log(`   Expected structure: uploads/project-name/image1.jpg, uploads/project-name/image2.jpg, etc.`);
    console.log(`   Supported formats: ${imageExtensions.join(', ')}`);
    process.exit(0);
  }

  // Count total images
  const totalImages = Object.values(projectImages).reduce((sum, images) => sum + images.length, 0);

  if (totalImages === 0) {
    console.log('⚠️  No image files found in project folders');
    console.log(`   Found project folders: ${projectNames.join(', ')}`);
    console.log(`   Supported formats: ${imageExtensions.join(', ')}`);
    process.exit(0);
  }

  console.log(`📊 Found ${projectNames.length} project folder(s) with ${totalImages} total image(s):\n`);
  projectNames.forEach(project => {
    console.log(`   📁 ${project}: ${projectImages[project].length} image(s)`);
  });
  console.log('');

  const results = [];
  let successCount = 0;
  let errorCount = 0;
  let fileIndex = 0;

  // Upload images for each project
  for (const projectName of projectNames) {
    const images = projectImages[projectName];
    
    if (images.length === 0) continue;

    console.log(`📤 Uploading ${images.length} image(s) for project: "${projectName}"`);

    for (const filePath of images) {
      fileIndex++;
      const fileName = basename(filePath);
      
      console.log(`   [${fileIndex}/${totalImages}] Uploading: ${fileName}...`);
      
      const result = await uploadImage(filePath, projectName, uploadsDir);
      results.push(result);

      if (result.success) {
        successCount++;
        console.log(`      ✅ Success: ${result.storagePath}`);
        console.log(`         URL: ${result.publicUrl}`);
      } else {
        errorCount++;
        console.log(`      ❌ Failed: ${result.error}`);
      }
    }
    console.log('');
  }

  // Summary
  console.log('='.repeat(70));
  console.log('📋 Upload Summary:');
  console.log(`   Projects processed: ${projectNames.length}`);
  console.log(`   Total files: ${totalImages}`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log('='.repeat(70));

  if (successCount > 0) {
    console.log('\n✅ Successfully uploaded files by project:');
    projectNames.forEach(projectName => {
      const projectResults = results.filter(r => r.projectName === projectName && r.success);
      if (projectResults.length > 0) {
        console.log(`\n   📁 ${projectName}:`);
        projectResults.forEach((r, i) => {
          console.log(`      ${i + 1}. ${r.storagePath}`);
        });
      }
    });
  }

  if (errorCount > 0) {
    console.log('\n❌ Failed uploads:');
    results
      .filter(r => !r.success)
      .forEach((r, i) => {
        console.log(`   ${i + 1}. [${r.projectName}] ${r.fileName}: ${r.error}`);
      });
  }

  // Return results for potential database update
  return {
    success: errorCount === 0,
    results: results.filter(r => r.success),
    projectImages: projectImages,
  };
}

uploadAllImages().then((summary) => {
  process.exit(summary.success ? 0 : 1);
}).catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
