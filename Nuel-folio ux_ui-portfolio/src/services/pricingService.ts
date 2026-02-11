/**
 * Pricing Service Utilities
 * 
 * Fetches pricing plans from Supabase pricing_plans table
 */

import { supabase, isSupabaseConfigured } from '../supabase';

export interface PricingPlan {
  id: string;
  plan_name: string; // Matches Supabase column name
  subtitle: string | null;
  price: string;
  unit: string | null; // Matches Supabase column name (replaces 'period')
  description: string | null;
  features: string[]; // TEXT array from database
  button_text: string | null; // Matches Supabase column name (replaces 'cta')
  note: string | null;
  is_popular: boolean;
}

/**
 * Fetches all pricing plans from Supabase
 * @returns Promise<PricingPlan[]> Array of pricing plans
 */
export const fetchPricingPlans = async (): Promise<PricingPlan[]> => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase is not configured. Using fallback pricing plans.');
    return [];
  }

  try {
    // Simple fetch - basic select query only
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*');

    if (error) {
      console.error('Error fetching pricing plans:', error);
      console.error('Error details:', { message: error.message, details: error.details, hint: error.hint });
      return [];
    }

    // Debug: Log fetched data to console
    console.log('Fetched Data:', data);

    // Parse features array if it's stored as JSON string
    const plans = (data || []).map((plan: any) => ({
      ...plan,
      features: Array.isArray(plan.features) 
        ? plan.features 
        : (typeof plan.features === 'string' ? JSON.parse(plan.features) : [])
    }));

    console.log('Processed Plans:', plans);

    return plans as PricingPlan[];
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return [];
  }
};
