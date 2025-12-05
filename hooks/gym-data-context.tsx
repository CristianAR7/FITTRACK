import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth-context';
import { Database } from '@/lib/database.types';

type Client = Database['public']['Tables']['clients']['Row'] & {
  profile: Database['public']['Tables']['profiles']['Row'];
};

type Gym = Database['public']['Tables']['gyms']['Row'];
type Routine = Database['public']['Tables']['routines']['Row'];
type Diet = Database['public']['Tables']['diets']['Row'];

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalRoutines: number;
  totalDiets: number;
}

interface GymDataContextType {
  gym: Gym | null;
  clients: Client[];
  routines: Routine[];
  diets: Diet[];
  stats: DashboardStats;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const GymDataContext = createContext<GymDataContextType | undefined>(undefined);

export function GymDataProvider({ children }: { children: React.ReactNode }) {
  const { profile, isGym, isMaster } = useAuth();
  const [gym, setGym] = useState<Gym | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);

  // Calcular estadísticas
  const stats: DashboardStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    totalRoutines: routines.length,
    totalDiets: diets.length,
  };

  // Cargar datos del gimnasio
  const loadGymData = async () => {
    if (!profile) return;

    try {
      setLoading(true);

      // Si es gym, cargar su gimnasio
      if (isGym && profile.gym_id) {
        const { data: gymData, error: gymError } = await supabase
          .from('gyms')
          .select('*')
          .eq('id', profile.gym_id)
          .single();

        if (gymError) throw gymError;
        setGym(gymData);

        // Cargar clientes del gimnasio
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select(`
            *,
            profile:profiles(*)
          `)
          .eq('gym_id', profile.gym_id)
          .order('created_at', { ascending: false });

        if (clientsError) throw clientsError;
        setClients(clientsData as Client[]);

        // Cargar rutinas del gimnasio
        const { data: routinesData, error: routinesError } = await supabase
          .from('routines')
          .select('*')
          .eq('gym_id', profile.gym_id)
          .order('created_at', { ascending: false });

        if (routinesError) throw routinesError;
        setRoutines(routinesData);

        // Cargar dietas del gimnasio
        const { data: dietsData, error: dietsError } = await supabase
          .from('diets')
          .select('*')
          .eq('gym_id', profile.gym_id)
          .order('created_at', { ascending: false });

        if (dietsError) throw dietsError;
        setDiets(dietsData);
      }

      // Si es master, cargar todos los datos
      if (isMaster) {
        const { data: gymsData } = await supabase
          .from('gyms')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (gymsData && gymsData.length > 0) {
          setGym(gymsData[0]);
        }

        const { data: allClientsData } = await supabase
          .from('clients')
          .select(`
            *,
            profile:profiles(*)
          `)
          .order('created_at', { ascending: false });

        if (allClientsData) {
          setClients(allClientsData as Client[]);
        }

        const { data: allRoutinesData } = await supabase
          .from('routines')
          .select('*')
          .order('created_at', { ascending: false });

        if (allRoutinesData) {
          setRoutines(allRoutinesData);
        }

        const { data: allDietsData } = await supabase
          .from('diets')
          .select('*')
          .order('created_at', { ascending: false });

        if (allDietsData) {
          setDiets(allDietsData);
        }
      }
    } catch (error) {
      console.error('Error loading gym data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recargar datos cuando cambie el perfil
  useEffect(() => {
    if (profile) {
      loadGymData();
    } else {
      setGym(null);
      setClients([]);
      setRoutines([]);
      setDiets([]);
      setLoading(false);
    }
  }, [profile]);

  const refreshData = async () => {
    await loadGymData();
  };

  const value = {
    gym,
    clients,
    routines,
    diets,
    stats,
    loading,
    refreshData,
  };

  return <GymDataContext.Provider value={value}>{children}</GymDataContext.Provider>;
}

export function useGymData() {
  const context = useContext(GymDataContext);
  if (context === undefined) {
    throw new Error('useGymData must be used within a GymDataProvider');
  }
  return context;
}
