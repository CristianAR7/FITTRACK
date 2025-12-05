export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'master' | 'gym' | 'client'
          gym_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role: 'master' | 'gym' | 'client'
          gym_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'master' | 'gym' | 'client'
          gym_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gyms: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          gym_id: string
          profile_id: string
          status: 'active' | 'inactive' | 'suspended'
          membership_start: string | null
          membership_end: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gym_id: string
          profile_id: string
          status?: 'active' | 'inactive' | 'suspended'
          membership_start?: string | null
          membership_end?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gym_id?: string
          profile_id?: string
          status?: 'active' | 'inactive' | 'suspended'
          membership_start?: string | null
          membership_end?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          muscle_group: string | null
          equipment: string | null
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          video_url: string | null
          image_url: string | null
          instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          muscle_group?: string | null
          equipment?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          video_url?: string | null
          image_url?: string | null
          instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          muscle_group?: string | null
          equipment?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          video_url?: string | null
          image_url?: string | null
          instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      routines: {
        Row: {
          id: string
          gym_id: string
          client_id: string
          name: string
          description: string | null
          goal: string | null
          duration_weeks: number | null
          frequency_per_week: number | null
          status: 'draft' | 'active' | 'completed' | 'archived'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gym_id: string
          client_id: string
          name: string
          description?: string | null
          goal?: string | null
          duration_weeks?: number | null
          frequency_per_week?: number | null
          status?: 'draft' | 'active' | 'completed' | 'archived'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gym_id?: string
          client_id?: string
          name?: string
          description?: string | null
          goal?: string | null
          duration_weeks?: number | null
          frequency_per_week?: number | null
          status?: 'draft' | 'active' | 'completed' | 'archived'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      routine_days: {
        Row: {
          id: string
          routine_id: string
          day_number: number
          name: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          routine_id: string
          day_number: number
          name: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          routine_id?: string
          day_number?: number
          name?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      routine_exercises: {
        Row: {
          id: string
          routine_day_id: string
          exercise_id: string
          order_index: number
          sets: number
          reps: string | null
          rest_seconds: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          routine_day_id: string
          exercise_id: string
          order_index: number
          sets?: number
          reps?: string | null
          rest_seconds?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          routine_day_id?: string
          exercise_id?: string
          order_index?: number
          sets?: number
          reps?: string | null
          rest_seconds?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      diets: {
        Row: {
          id: string
          gym_id: string
          client_id: string
          name: string
          description: string | null
          goal: string | null
          daily_calories: number | null
          daily_protein_g: number | null
          daily_carbs_g: number | null
          daily_fats_g: number | null
          status: 'draft' | 'active' | 'completed' | 'archived'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gym_id: string
          client_id: string
          name: string
          description?: string | null
          goal?: string | null
          daily_calories?: number | null
          daily_protein_g?: number | null
          daily_carbs_g?: number | null
          daily_fats_g?: number | null
          status?: 'draft' | 'active' | 'completed' | 'archived'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gym_id?: string
          client_id?: string
          name?: string
          description?: string | null
          goal?: string | null
          daily_calories?: number | null
          daily_protein_g?: number | null
          daily_carbs_g?: number | null
          daily_fats_g?: number | null
          status?: 'draft' | 'active' | 'completed' | 'archived'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      diet_meals: {
        Row: {
          id: string
          diet_id: string
          meal_number: number
          name: string
          time: string | null
          calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fats_g: number | null
          foods: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          diet_id: string
          meal_number: number
          name: string
          time?: string | null
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fats_g?: number | null
          foods?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          diet_id?: string
          meal_number?: number
          name?: string
          time?: string | null
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fats_g?: number | null
          foods?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress_logs: {
        Row: {
          id: string
          client_id: string
          log_date: string
          weight_kg: number | null
          body_fat_percentage: number | null
          muscle_mass_kg: number | null
          notes: string | null
          photos: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          log_date: string
          weight_kg?: number | null
          body_fat_percentage?: number | null
          muscle_mass_kg?: number | null
          notes?: string | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          log_date?: string
          weight_kg?: number | null
          body_fat_percentage?: number | null
          muscle_mass_kg?: number | null
          notes?: string | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_logs: {
        Row: {
          id: string
          client_id: string
          routine_exercise_id: string | null
          log_date: string
          exercise_name: string
          sets_completed: number
          reps_completed: string | null
          weight_kg: number | null
          duration_minutes: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          routine_exercise_id?: string | null
          log_date: string
          exercise_name: string
          sets_completed: number
          reps_completed?: string | null
          weight_kg?: number | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          routine_exercise_id?: string | null
          log_date?: string
          exercise_name?: string
          sets_completed?: number
          reps_completed?: string | null
          weight_kg?: number | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
