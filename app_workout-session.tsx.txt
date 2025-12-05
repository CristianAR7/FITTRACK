import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Clock, 
  Repeat,
  Weight,
  Check,
  X,
} from 'lucide-react-native';
import { useGymData } from '@/hooks/gym-data-context';

type ExerciseProgress = {
  exerciseId: string;
  sets: {
    reps: number;
    weight?: number;
    completed: boolean;
  }[];
};

type WorkoutProgress = {
  workoutId: string;
  exercises: ExerciseProgress[];
  startTime: Date;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restStartTime?: Date;
  restDuration: number;
};

export default function WorkoutSessionScreen() {
  const { routineId, workoutId } = useLocalSearchParams();
  const { routines, exercises } = useGymData();
  const insets = useSafeAreaInsets();
  
  const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress | null>(null);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  const routine = routines.find(r => r.id === routineId);
  const workout = routine?.workouts.find(w => w.id === workoutId);
  
  useEffect(() => {
    if (workout && !workoutProgress) {
      const initialProgress: WorkoutProgress = {
        workoutId: workout.id,
        exercises: workout.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: Array(ex.sets).fill(null).map(() => ({
            reps: parseInt(ex.reps.toString()),
            weight: undefined,
            completed: false,
          })),
        })),
        startTime: new Date(),
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        isResting: false,
        restDuration: workout.exercises[0]?.rest || 60,
      };
      setWorkoutProgress(initialProgress);
      setIsActive(true);
    }
  }, [workout, workoutProgress]);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (workoutProgress?.isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(timer => {
          if (timer <= 1) {
            setWorkoutProgress(prev => prev ? { ...prev, isResting: false } : null);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workoutProgress?.isResting, restTimer]);
  
  if (!routine || !workout || !workoutProgress) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Entrenamiento no encontrado</Text>
      </View>
    );
  }
  
  const currentExercise = workout.exercises[workoutProgress.currentExerciseIndex];
  const currentExerciseData = exercises.find(e => e.id === currentExercise?.exerciseId);
  const currentExerciseProgress = workoutProgress.exercises[workoutProgress.currentExerciseIndex];
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const completeSet = () => {
    if (!currentExerciseProgress) return;
    
    const updatedProgress = { ...workoutProgress };
    updatedProgress.exercises[workoutProgress.currentExerciseIndex].sets[workoutProgress.currentSetIndex].completed = true;
    
    const isLastSet = workoutProgress.currentSetIndex === currentExerciseProgress.sets.length - 1;
    const isLastExercise = workoutProgress.currentExerciseIndex === workout.exercises.length - 1;
    
    if (isLastSet && isLastExercise) {
      setShowCompleteModal(true);
      setIsActive(false);
    } else if (isLastSet) {
      updatedProgress.currentExerciseIndex += 1;
      updatedProgress.currentSetIndex = 0;
      updatedProgress.isResting = true;
      updatedProgress.restDuration = workout.exercises[updatedProgress.currentExerciseIndex]?.rest || 60;
      setRestTimer(updatedProgress.restDuration);
    } else {
      updatedProgress.currentSetIndex += 1;
      updatedProgress.isResting = true;
      updatedProgress.restDuration = currentExercise.rest;
      setRestTimer(currentExercise.rest);
    }
    
    setWorkoutProgress(updatedProgress);
  };
  
  const skipRest = () => {
    setWorkoutProgress(prev => prev ? { ...prev, isResting: false } : null);
    setRestTimer(0);
  };
  
  const finishWorkout = () => {
    setShowCompleteModal(false);
    router.back();
  };
  
  const quitWorkout = () => {
    if (Platform.OS === 'web') {
      const confirmed = confirm('¿Estás seguro de que quieres salir? Se perderá el progreso.');
      if (confirmed) {
        router.back();
      }
    } else {
      Alert.alert(
        'Salir del entrenamiento',
        '¿Estás seguro de que quieres salir? Se perderá el progreso.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: () => router.back() },
        ]
      );
    }
  };
  
  const totalSets = workoutProgress.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workoutProgress.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(set => set.completed).length,
    0
  );
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={quitWorkout}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.workoutTitle}>{workout.name}</Text>
          <View style={styles.timerContainer}>
            <Clock size={16} color="#10B981" />
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Serie {completedSets + 1} de {totalSets}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(completedSets / totalSets) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </LinearGradient>
      
      {workoutProgress.isResting ? (
        <View style={styles.restContainer}>
          <LinearGradient
            colors={['#DC2626', '#991B1B']}
            style={styles.restCard}
          >
            <Text style={styles.restTitle}>Descanso</Text>
            <Text style={styles.restTimer}>{formatTime(restTimer)}</Text>
            <TouchableOpacity style={styles.skipButton} onPress={skipRest}>
              <Text style={styles.skipButtonText}>Saltar descanso</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{currentExerciseData?.name}</Text>
            <Text style={styles.exerciseDescription}>
              Serie {workoutProgress.currentSetIndex + 1} de {currentExerciseProgress?.sets.length}
            </Text>
            
            <View style={styles.exerciseStats}>
              <View style={styles.stat}>
                <Repeat size={20} color="#10B981" />
                <Text style={styles.statValue}>{currentExercise.reps}</Text>
                <Text style={styles.statLabel}>repeticiones</Text>
              </View>
              <View style={styles.stat}>
                <Weight size={20} color="#3B82F6" />
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}>peso (kg)</Text>
              </View>
              <View style={styles.stat}>
                <Clock size={20} color="#F59E0B" />
                <Text style={styles.statValue}>{currentExercise.rest}s</Text>
                <Text style={styles.statLabel}>descanso</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.completeButton} onPress={completeSet}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.completeButtonGradient}
              >
                <Check size={20} color="#fff" />
                <Text style={styles.completeButtonText}>Completar Serie</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.setsContainer}>
            <Text style={styles.setsTitle}>Series</Text>
            {currentExerciseProgress?.sets.map((set, index) => (
              <View 
                key={`set-${index}`} 
                style={[
                  styles.setItem,
                  set.completed && styles.setCompleted,
                  index === workoutProgress.currentSetIndex && styles.setActive,
                ]}
              >
                <Text style={[
                  styles.setNumber,
                  set.completed && styles.setCompletedText,
                  index === workoutProgress.currentSetIndex && styles.setActiveText,
                ]}>
                  {index + 1}
                </Text>
                <Text style={[
                  styles.setReps,
                  set.completed && styles.setCompletedText,
                  index === workoutProgress.currentSetIndex && styles.setActiveText,
                ]}>
                  {set.reps} reps
                </Text>
                {set.completed && (
                  <Check size={16} color="#10B981" />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
      
      <Modal
        visible={showCompleteModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.modalGradient}
            >
              <Check size={48} color="#fff" />
              <Text style={styles.modalTitle}>¡Entrenamiento Completado!</Text>
              <Text style={styles.modalSubtitle}>
                Has completado {totalSets} series en {formatTime(timer)}
              </Text>
              
              <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
                <Text style={styles.finishButtonText}>Finalizar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(156, 163, 175, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  restContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  restCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  restTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  restTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  setsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  setsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    borderRadius: 8,
    marginBottom: 8,
  },
  setActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  setCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  setNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9CA3AF',
    width: 30,
  },
  setReps: {
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
  },
  setActiveText: {
    color: '#10B981',
  },
  setCompletedText: {
    color: '#10B981',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  finishButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});