import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Clock, 
  Repeat,
  Weight,
  Info,
  Play,
  X,
  Video,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import { useGymData } from '@/hooks/gym-data-context';
import { useAuth } from '@/hooks/auth-context';

export default function RoutineDetailScreen() {
  const { routineId } = useLocalSearchParams();
  const { routines, exercises } = useGymData();
  const { authState } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState<typeof exercises[0] | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  
  const routine = routines.find(r => r.id === routineId);
  
  if (!routine) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Rutina no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.header}
      >
        <Text style={styles.routineName}>{routine.name}</Text>
        <Text style={styles.routineDescription}>{routine.description}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Clock size={20} color="#10B981" />
            <Text style={styles.statValue}>{routine.duration}</Text>
            <Text style={styles.statLabel}>minutos</Text>
          </View>
          <View style={styles.stat}>
            <Repeat size={20} color="#3B82F6" />
            <Text style={styles.statValue}>{routine.frequency}</Text>
            <Text style={styles.statLabel}>frecuencia</Text>
          </View>
        </View>

        {authState.role === 'client' && (
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => {
              if (routine.workouts.length === 1) {
                router.push({
                  pathname: '/workout-session',
                  params: { 
                    routineId: routine.id, 
                    workoutId: routine.workouts[0].id 
                  }
                });
              } else {
                setShowWorkoutModal(true);
              }
            }}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.startButtonGradient}
            >
              <Play size={20} color="#fff" />
              <Text style={styles.startButtonText}>Comenzar Rutina</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <View style={styles.workoutsContainer}>
        {routine.workouts.map((workout, workoutIndex) => (
          <View key={workout.id} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              {workout.dayOfWeek !== undefined && (
                <Text style={styles.workoutDay}>
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][workout.dayOfWeek]}
                </Text>
              )}
            </View>

            {workout.exercises.map((exercise, exerciseIndex) => {
              const exerciseData = exercises.find(e => e.id === exercise.exerciseId);
              
              return (
                <View key={exerciseIndex} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>
                      {exerciseData?.name || 'Ejercicio'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (exerciseData) {
                          setSelectedExercise(exerciseData);
                          setShowExerciseModal(true);
                        }
                      }}
                    >
                      <Info size={18} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.exerciseDetails}>
                    <View style={styles.exerciseDetail}>
                      <Repeat size={14} color="#10B981" />
                      <Text style={styles.exerciseDetailText}>
                        {exercise.sets} series
                      </Text>
                    </View>
                    <View style={styles.exerciseDetail}>
                      <Weight size={14} color="#3B82F6" />
                      <Text style={styles.exerciseDetailText}>
                        {exercise.reps} reps
                      </Text>
                    </View>
                    <View style={styles.exerciseDetail}>
                      <Clock size={14} color="#F59E0B" />
                      <Text style={styles.exerciseDetailText}>
                        {exercise.rest}s descanso
                      </Text>
                    </View>
                  </View>

                  {exercise.notes && (
                    <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                  )}

                  {exerciseData && (
                    <View style={styles.muscleGroups}>
                      <Text style={styles.muscleLabel}>Músculo principal:</Text>
                      <Text style={styles.muscleText}>{exerciseData.primaryMuscle}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <Modal
        visible={showExerciseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
              <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
                <X size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedExercise?.gifUrl && (
                <View style={styles.mediaContainer}>
                  <Image
                    source={{ uri: selectedExercise.gifUrl }}
                    style={styles.exerciseGif}
                    resizeMode="contain"
                  />
                </View>
              )}

              {selectedExercise?.videoUrl && (
                <TouchableOpacity
                  style={styles.videoButton}
                  onPress={() => {
                    if (selectedExercise.videoUrl) {
                      Linking.openURL(selectedExercise.videoUrl);
                    }
                  }}
                >
                  <LinearGradient
                    colors={['#DC2626', '#991B1B']}
                    style={styles.videoButtonGradient}
                  >
                    <Video size={20} color="#fff" />
                    <Text style={styles.videoButtonText}>Ver Video Tutorial</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instrucciones</Text>
                {selectedExercise?.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <Text style={styles.instructionNumber}>{index + 1}.</Text>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>

              {selectedExercise?.tips && selectedExercise.tips.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Consejos</Text>
                  {selectedExercise.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <CheckCircle size={16} color="#10B981" />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {selectedExercise?.commonMistakes && selectedExercise.commonMistakes.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Errores Comunes</Text>
                  {selectedExercise.commonMistakes.map((mistake, index) => (
                    <View key={index} style={styles.mistakeItem}>
                      <AlertCircle size={16} color="#EF4444" />
                      <Text style={styles.mistakeText}>{mistake}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Músculos Trabajados</Text>
                <View style={styles.muscleInfo}>
                  <Text style={styles.muscleLabel}>Principal:</Text>
                  <Text style={styles.musclePrimary}>{selectedExercise?.primaryMuscle}</Text>
                </View>
                {selectedExercise?.secondaryMuscles && selectedExercise.secondaryMuscles.length > 0 && (
                  <View style={styles.muscleInfo}>
                    <Text style={styles.muscleLabel}>Secundarios:</Text>
                    <Text style={styles.muscleSecondary}>
                      {selectedExercise.secondaryMuscles.join(', ')}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Equipamiento</Text>
                <Text style={styles.equipmentText}>{selectedExercise?.equipment}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showWorkoutModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWorkoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.workoutModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Entrenamiento</Text>
              <TouchableOpacity onPress={() => setShowWorkoutModal(false)}>
                <X size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.workoutList} showsVerticalScrollIndicator={false}>
              {routine.workouts.map((workout, index) => (
                <TouchableOpacity
                  key={workout.id}
                  style={styles.workoutOption}
                  onPress={() => {
                    setShowWorkoutModal(false);
                    router.push({
                      pathname: '/workout-session',
                      params: { 
                        routineId: routine.id, 
                        workoutId: workout.id 
                      }
                    });
                  }}
                >
                  <LinearGradient
                    colors={['#1F2937', '#111827']}
                    style={styles.workoutOptionGradient}
                  >
                    <View style={styles.workoutOptionHeader}>
                      <Text style={styles.workoutOptionName}>{workout.name}</Text>
                      {workout.dayOfWeek !== undefined && (
                        <Text style={styles.workoutOptionDay}>
                          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][workout.dayOfWeek]}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.workoutOptionExercises}>
                      {workout.exercises.length} ejercicios
                    </Text>
                    <View style={styles.workoutOptionStats}>
                      <View style={styles.workoutOptionStat}>
                        <Clock size={14} color="#10B981" />
                        <Text style={styles.workoutOptionStatText}>
                          ~{Math.round(workout.exercises.reduce((acc, ex) => acc + (ex.sets * ex.rest), 0) / 60)} min
                        </Text>
                      </View>
                      <View style={styles.workoutOptionStat}>
                        <Repeat size={14} color="#3B82F6" />
                        <Text style={styles.workoutOptionStatText}>
                          {workout.exercises.reduce((acc, ex) => acc + ex.sets, 0)} series
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    paddingBottom: 24,
  },
  routineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  routineDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutsContainer: {
    padding: 16,
  },
  workoutCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  workoutDay: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  exerciseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseDetailText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  exerciseNotes: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  muscleGroups: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.2)',
  },
  muscleText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(156, 163, 175, 0.2)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 16,
  },
  modalBody: {
    padding: 20,
  },
  mediaContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  exerciseGif: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  videoButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  instructionNumber: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: 'bold',
    marginRight: 8,
    width: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 20,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  mistakeText: {
    fontSize: 14,
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 20,
  },
  muscleInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  muscleLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 8,
  },
  musclePrimary: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  muscleSecondary: {
    fontSize: 14,
    color: '#3B82F6',
  },
  equipmentText: {
    fontSize: 14,
    color: '#D1D5DB',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  workoutModalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
  },
  workoutList: {
    padding: 20,
    maxHeight: 400,
  },
  workoutOption: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  workoutOptionGradient: {
    padding: 16,
  },
  workoutOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  workoutOptionDay: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  workoutOptionExercises: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  workoutOptionStats: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutOptionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutOptionStatText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});