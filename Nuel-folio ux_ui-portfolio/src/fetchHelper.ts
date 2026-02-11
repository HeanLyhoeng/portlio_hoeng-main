import { supabase } from './supabase';
import { Database } from '../../database.types';

// Define a type for a row in the 'projects' table
type ProjectRow = Database['public']['Tables']['projects']['Row'];

/**
 * Example function to fetch projects from the 'projects' table.
 * Because 'supabase' is now typed with <Database>, typescript knows
 * exactly what columns exist on 'projects'.
 */
export const fetchProjects = async (): Promise<ProjectRow[] | null> => {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return null;
    }

    return data;
};

/**
 * Generic fetch function for any table
 * @param tableName - The name of the table to fetch from (e.g., 'video_links', 'hero_content')
 */
export const fetchTableData = async <T extends keyof Database['public']['Tables']>(
    tableName: T
) => {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from(tableName)
        .select('*');

    if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return null;
    }

    return data;
};
