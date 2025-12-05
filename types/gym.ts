export interface Gym {
  id: string;
  name: string;
  email: string;
  password: string;
  logo?: string;
  primaryColor: string;
  subscriptionActive: boolean;
  subscriptionEndDate?: string;
  lastPaymentDate?: string;
  plan?: 'basic' | 'premium' | 'enterprise';
  clientCount?: number;
}

export interface User {
  id: string;
  gymId: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  currentWeight: number; // kg
  targetWeight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';
  equipment: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
  gifUrl?: string;
  tips?: string[];
  commonMistakes?: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string; // "8-12" or "12"
  rest: number; // seconds
  weight?: number; // kg
  duration?: number; // seconds for time-based exercises
  notes?: string;
}

export interface Routine {
  id: string;
  gymId: string;
  name: string;
  description: string;
  type: 'generic' | 'specific';
  userId?: string; // for specific routines
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  frequency: string; // "3x week"
  workouts: Workout[];
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  name: string;
  dayOfWeek?: number; // 0-6
  exercises: WorkoutExercise[];
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  fiber: number; // grams
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'dairy' | 'fats' | 'other';
}

export interface DietPlan {
  id: string;
  gymId: string;
  name: string;
  description: string;
  type: 'generic' | 'specific';
  userId?: string;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance';
  dailyCalories: number;
  macros: {
    protein: number; // percentage
    carbs: number;
    fats: number;
  };
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export interface WeightRecord {
  id: string;
  userId: string;
  weight: number; // kg
  date: string;
  bodyFat?: number; // percentage
  muscleMass?: number; // kg
  waterPercentage?: number;
  visceralFat?: number;
  bmi?: number;
  notes?: string;
}

export interface Measurements {
  id: string;
  userId: string;
  date: string;
  chest?: number; // cm
  waist?: number;
  hips?: number;
  thighs?: number;
  arms?: number;
  shoulders?: number;
  neck?: number;
}

export interface ShoppingListItem {
  ingredient: Ingredient;
  checked: boolean;
}

export type AuthRole = 'gym' | 'client' | 'master';

export interface AuthState {
  role: AuthRole | null;
  gymId: string | null;
  userId: string | null;
  gym: Gym | null;
  user: User | null;
  isMaster?: boolean;
}

export interface MasterAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}