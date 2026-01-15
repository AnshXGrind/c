/**
 * Supabase Client for Frontend (React/Next.js)
 * Install: npm install @supabase/supabase-js
 */

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️  Supabase not configured. Database features disabled.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder_key"
);

// Analysis type definition
export type Analysis = {
  id: string;
  user_id: string;
  resume_text: string;
  job_description: string;
  score: number;
  sub_scores: Record<string, number>;
  skills: string[];
  missing_skills: string[];
  roadmap: RoadmapPhase[];
  created_at: string;
};

export type RoadmapPhase = {
  phase: string;
  days: string;
  skills: string[];
  resources: Resource[];
};

export type Resource = {
  title: string;
  type: string;
  url: string;
  hours: number;
};

// Save analysis to Supabase
export async function saveAnalysis(analysis: Omit<Analysis, "id" | "created_at">) {
  try {
    const { data, error } = await supabase
      .from("analyses")
      .insert([analysis])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving analysis:", error);
    return { success: false, error };
  }
}

// Get user's analyses
export async function getUserAnalyses(userId: string) {
  try {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return { success: false, error };
  }
}

// Delete analysis
export async function deleteAnalysis(analysisId: string) {
  try {
    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", analysisId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting analysis:", error);
    return { success: false, error };
  }
}

// Real-time listener for analyses (Supabase v2 syntax)
export function subscribeToAnalyses(
  userId: string,
  callback: (analysis: Analysis) => void
) {
  const channel = supabase
    .channel('analyses-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'analyses',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as Analysis);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}
