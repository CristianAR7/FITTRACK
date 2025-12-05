import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Dumbbell, 
  Clock, 
  Calendar,
  ChevronRight,
  Plus,
  Filter,
  User,
  Users,
  Edit3,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-context';
import { useGymData } from '@/hooks/gym-data-context';
import { router } from 'expo-router';
import { Routine } from '@/types/gym';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return '#10B981';
    case 'intermediate': return '#F59E0B';
    case 'advanced': return '#EF4444';
    default: return '#6B7280';
  }
};

export default function RoutinesScreen() {
  const { authState } = useAuth();
  const { routines, exercises } = useGymData();
  const [filter, setFilter] = useState<'all' | 'generic' | 'specific'>('all');
  
  const isGym = authState.role === 'gym';
  
  if (isGym) {
    // Gym view: Show created routines for management
    const gymRoutines = routines.filter(routine => 
      routine.type === 'generic' || (routine.type === 'specific' && routine.gymId === authState.gymId)
    );

    const filteredGymRoutines = gymRoutines.filter(routine => {
      if (filter === 'all') return true;
      return routine.type === filter;
    });

    const renderRoutineManagementCard = ({ item }: { item: Routine }) => {
      const totalExercises = item.workouts.reduce((acc, w) => acc + w.exercises.length, 0);
      const assignedCount = item.type === 'specific' ? 1 : 0; // Mock assigned count
      
      return (
        <TouchableOpacity 
          style={styles.routineCard}
          onPress={() => router.push(`/routines/${item.id}`)}
        >
          <LinearGradient
            colors={['#1F2937', '#111827']}
            style={styles.routineGradient}
          >
            <View style={styles.routineHeader}>
              <View style={styles.routineTypeContainer}>
                {item.type === 'specific' ? (
                  <User size={16} color="#10B981" />
                ) : (
                  <Users size={16} color="#3B82F6" />
                )}
                <Text style={styles.routineType}>
                  {item.type === 'specific' ? 'Personalizada' : 'Genérica'}
                </Text>
              </View>
              <View style={styles.routineActions}>
                <TouchableOpacity 
                  style={styles.editRoutineButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push(`/routines/edit?routineId=${item.id}`);
                  }}
                >
                  <Edit3 size={16} color="#F59E0B" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.assignRoutineButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push(`/routines/assign?routineId=${item.id}`);
                  }}
                >
                  <Users size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.routineName}>{item.name}</Text>
            <Text style={styles.routineDescription} numberOfLines={2}>
              {item.description}
            </Text>
            
            <View style={styles.routineStats}>
              <View style={styles.routineStat}>
                <Clock size={14} color="#9CA3AF" />
                <Text style={styles.routineStatText}>{item.duration} min</Text>
              </View>
              <View style={styles.routineStat}>
                <Calendar size={14} color="#9CA3AF" />
                <Text style={styles.routineStatText}>{item.frequency}</Text>
              </View>
              <View style={styles.routineStat}>
                <Dumbbell size={14} color="#9CA3AF" />
                <Text style={styles.routineStatText}>{totalExercises} ejercicios</Text>
              </View>
            </View>
            
            <View style={styles.routineFooter}>
              <View style={styles.routineDifficulty}>
                <Text style={styles.difficultyLabel}>Nivel:</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                  <Text style={styles.difficultyText}>
                    {item.difficulty === 'beginner' ? 'Principiante' : 
                     item.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                  </Text>
                </View>
              </View>
              
              {assignedCount > 0 && (
                <Text style={styles.assignedCount}>
                  Asignada a {assignedCount} cliente{assignedCount > 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Gestión de Rutinas</Text>
            <Text style={styles.headerSubtitle}>
              Administra las rutinas de entrenamiento de tu gimnasio
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/routines/create')}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.addButtonGradient}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Nueva Rutina</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                Todas ({gymRoutines.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'generic' && styles.filterButtonActive]}
              onPress={() => setFilter('generic')}
            >
              <Text style={[styles.filterText, filter === 'generic' && styles.filterTextActive]}>
                Genéricas ({gymRoutines.filter(r => r.type === 'generic').length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'specific' && styles.filterButtonActive]}
              onPress={() => setFilter('specific')}
            >
              <Text style={[styles.filterText, filter === 'specific' && styles.filterTextActive]}>
                Personalizadas ({gymRoutines.filter(r => r.type === 'specific').length})
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {filteredGymRoutines.length === 0 ? (
          <View style={styles.emptyState}>
            <Dumbbell size={48} color="#6B7280" />
            <Text style={styles.emptyStateTitle}>No hay rutinas</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'all' 
                ? 'Crea tu primera rutina para empezar a asignar a tus clientes'
                : `No hay rutinas ${filter === 'generic' ? 'genéricas' : 'personalizadas'} creadas`
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredGymRoutines}
            renderItem={renderRoutineManagementCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  }
  
  // Client view: Show available routines for the user
  const filteredRoutines = routines.filter(routine => {
    if (routine.type === 'specific' && routine.userId !== authState.userId) {
      return false;
    }
    if (filter === 'all') return true;
    return routine.type === filter;
  });



  const renderRoutineCard = ({ item }: { item: Routine }) => {
    const totalExercises = item.workouts.reduce((acc, w) => acc + w.exercises.length, 0);
    
    return (
      <TouchableOpacity 
        style={styles.routineCard}
        onPress={() => router.push(`/routines/${item.id}`)}
      >
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.routineGradient}
        >
          <View style={styles.routineHeader}>
            <View style={styles.routineTypeContainer}>
              {item.type === 'specific' ? (
                <User size={16} color="#10B981" />
              ) : (
                <Users size={16} color="#3B82F6" />
              )}
              <Text style={styles.routineType}>
                {item.type === 'specific' ? 'Personalizada' : 'Genérica'}
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
          
          <Text style={styles.routineName}>{item.name}</Text>
          <Text style={styles.routineDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.routineStats}>
            <View style={styles.routineStat}>
              <Clock size={14} color="#9CA3AF" />
              <Text style={styles.routineStatText}>{item.duration} min</Text>
            </View>
            <View style={styles.routineStat}>
              <Calendar size={14} color="#9CA3AF" />
              <Text style={styles.routineStatText}>{item.frequency}</Text>
            </View>
            <View style={styles.routineStat}>
              <Dumbbell size={14} color="#9CA3AF" />
              <Text style={styles.routineStatText}>{totalExercises} ejercicios</Text>
            </View>
          </View>
          
          <View style={styles.routineDifficulty}>
            <Text style={styles.difficultyLabel}>Nivel:</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
              <Text style={styles.difficultyText}>
                {item.difficulty === 'beginner' ? 'Principiante' : 
                 item.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'generic' && styles.filterButtonActive]}
            onPress={() => setFilter('generic')}
          >
            <Text style={[styles.filterText, filter === 'generic' && styles.filterTextActive]}>
              Genéricas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'specific' && styles.filterButtonActive]}
            onPress={() => setFilter('specific')}
          >
            <Text style={[styles.filterText, filter === 'specific' && styles.filterTextActive]}>
              Personalizadas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredRoutines}
        renderItem={renderRoutineCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  addButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#10B981',
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  routineCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  routineGradient: {
    padding: 16,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routineTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routineType: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  routineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  routineDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    lineHeight: 20,
  },
  routineStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  routineStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routineStatText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  routineDifficulty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  routineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assignRoutineButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  editRoutineButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  routineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  assignedCount: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});