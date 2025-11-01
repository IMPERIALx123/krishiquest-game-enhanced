import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string | null;
          location: string | null;
          farm_size: string | null;
          primary_crops: string | null;
          avatar_url: string | null;
          total_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      fields: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          size_acres: number;
          soil_condition: string;
          moisture_level: number;
          image_url: string | null;
          location: string | null;
          current_stage: string;
          last_scanned_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fields']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['fields']['Insert']>;
      };
      field_scans: {
        Row: {
          id: string;
          field_id: string;
          user_id: string;
          scan_type: string;
          detected_stage: string;
          image_url: string | null;
          moisture_level: number;
          soil_condition: string;
          recommendations: any;
          verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['field_scans']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['field_scans']['Insert']>;
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          tags: string[];
          image_url: string | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>;
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['post_likes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['post_likes']['Insert']>;
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['post_comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['post_comments']['Insert']>;
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          field_id: string | null;
          title: string;
          description: string | null;
          task_type: string;
          points: number;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          progress: number;
          max_progress: number;
          unlocked: boolean;
          unlocked_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>;
      };
    };
  };
};
