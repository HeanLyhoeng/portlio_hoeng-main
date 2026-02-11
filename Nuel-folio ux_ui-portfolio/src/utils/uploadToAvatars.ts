/**
 * Upload file to Supabase storage bucket named 'avatars'
 * 
 * This function uses the Supabase client SDK to upload files to the 'avatars' bucket.
 * 
 * Usage example:
 * ```typescript
 * import { uploadFileToAvatars } from '@/utils/uploadToAvatars';
 * 
 * const file = event.target.files[0];
 * const { data, error } = await uploadFileToAvatars(file, 'user-123-avatar.png');
 * 
 * if (error) {
 *   console.error('Upload failed:', error);
 * } else {
 *   console.log('File uploaded:', data.path);
 *   const publicUrl = supabase.storage.from('avatars').getPublicUrl(data.path);
 * }
 * ```
 */

import { supabase } from '../supabase';

export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl?: string;
}

export interface UploadError {
  message: string;
  error?: any;
}

/**
 * Upload a file to the 'avatars' storage bucket
 * 
 * @param file - The file to upload (File object from input or FormData)
 * @param fileName - Optional custom filename. If not provided, uses the file's name
 * @param folder - Optional folder path within the bucket (e.g., 'users', 'profile-pics')
 * @returns Object with path and publicUrl if successful, or error object
 */
export async function uploadFileToAvatars(
  file: File | Blob,
  fileName?: string,
  folder?: string
): Promise<{ data: UploadResult | null; error: UploadError | null }> {
  if (!supabase) {
    return {
      data: null,
      error: {
        message: 'Supabase client is not configured. Check your environment variables.',
      },
    };
  }

  try {
    // Generate filename if not provided
    const fileExtension = file instanceof File 
      ? file.name.split('.').pop() 
      : 'bin';
    const finalFileName = fileName || 
      (file instanceof File 
        ? `${Date.now()}-${file.name}` 
        : `${Date.now()}.${fileExtension}`);
    
    // Construct the path
    const filePath = folder ? `${folder}/${finalFileName}` : finalFileName;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Set to true if you want to overwrite existing files
      });

    if (error) {
      return {
        data: null,
        error: {
          message: `Upload failed: ${error.message}`,
          error: error,
        },
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return {
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl: publicUrlData.publicUrl,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: `Upload error: ${error.message || 'Unknown error'}`,
        error: error,
      },
    };
  }
}

/**
 * Delete a file from the 'avatars' storage bucket
 * 
 * @param filePath - The path to the file to delete
 */
export async function deleteFileFromAvatars(
  filePath: string
): Promise<{ error: UploadError | null }> {
  if (!supabase) {
    return {
      error: {
        message: 'Supabase client is not configured. Check your environment variables.',
      },
    };
  }

  const { error } = await supabase.storage
    .from('avatars')
    .remove([filePath]);

  if (error) {
    return {
      error: {
        message: `Delete failed: ${error.message}`,
        error: error,
      },
    };
  }

  return { error: null };
}
