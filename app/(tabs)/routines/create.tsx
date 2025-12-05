import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Users,
  User,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useGymData } from '@/hooks/gym-data-context';
import { Routine, Workout, WorkoutExercise } from '@/types/gym';

export default function CreateRoutineScreen() {
  const { addRoutine, exercises } = useGymData();
  const [routineName, setRoutineName] = useState<string>('');
  const [routineDescription, setRoutineDescription] = useState<string>('');
  const [routineType, setRoutineType] = useState<'generic' | 'specific'>('generic');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [duration, setDuration] = useState<string>('60');
  const [frequency, setFrequency] = useState<string>('3x semana');
  const [workouts, setWorkouts] = useState<Workout[]>([{
    id: '1',
    name: 'Día 1',
    exercises: []
  }]);

  const addWorkout = () => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: `Día ${workouts.length + 1}`,
      exercises: []
    };
    setWorkouts([...workouts, newWorkout]);
  };

  const removeWorkout = (workoutId: string) => {
    if (workouts.length > 1) {
      setWorkouts(workouts.filter(w => w.id !== workoutId));
    }
  };

  const addExerciseToWorkout = (workoutId: string) => {
    const exercise = exercises[0]; // Use first exercise as default
    if (!exercise) return;

    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      sets: 3,
      reps: '12',
      rest: 60,
      weight: 0,
      notes: ''
    };

    setWorkouts(workouts.map(workout => 
      workout.id === workoutId 
        ? { ...workout, exercises: [...workout.exercises, newExercise] }
        : workout
    ));
  };

  const removeExerciseFromWorkout = (workoutId: string, exerciseIndex: number) => {
    setWorkouts(workouts.map(workout => 
      workout.id === workoutId 
        ? { ...workout, exercises: workout.exercises.filter((_, index) => index !== exerciseIndex) }
        : workout
    ));
  };

  const updateExercise = (workoutId: string, exerciseIndex: number, field: keyof WorkoutExercise, value: any) => {
    setWorkouts(workouts.map(workout => 
      workout.id === workoutId 
        ? {
            ...workout, 
            exercises: workout.exercises.map((exercise, index) => 
              index === exerciseIndex 
                ? { ...exercise, [field]: value }
                : exercise
            )
          }
        : workout
    ));
  };

  const saveRoutine = () => {
    if (!routineName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la rutina');
      return;
    }

    if (workouts.some(w => w.exercises.length === 0)) {
      Alert.alert('Error', 'Todos los días deben tener al menos un ejercicio');
      return;
    }

    const newRoutine: Routine = {
      id: Date.now().toString(),
      gymId: 'gym1',
      name: routineName,
      description: routineDescription,
      type: routineType,
      difficulty,
      duration: parseInt(duration),
      frequency,
      workouts,
      userId: routineType === 'specific' ? 'user1' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addRoutine(newRoutine);
    Alert.alert('Éxito', 'Rutina creada correctamente', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Rutina</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveRoutine}
        >
          <Save size={24} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la rutina</Text>
            <TextInput
              style={styles.input}
              value={routineName}
              onChangeText={setRoutineName}
              placeholder="Ej: Rutina de Fuerza"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={routineDescription}
              onChangeText={setRoutineDescription}
              placeholder="Describe los objetivos de esta rutina..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de rutina</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[styles.typeButton, routineType === 'generic' && styles.typeButtonActive]}
                onPress={() => setRoutineType('generic')}
              >
                <Users size={20} color={routineType === 'generic' ? '#fff' : '#9CA3AF'} />
                <Text style={[styles.typeButtonText, routineType === 'generic' && styles.typeButtonTextActive]}>
                  Genérica
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, routineType === 'specific' && styles.typeButtonActive]}
                onPress={() => setRoutineType('specific')}
              >
                <User size={20} color={routineType === 'specific' ? '#fff' : '#9CA3AF'} />
                <Text style={[styles.typeButtonText, routineType === 'specific' && styles.typeButtonTextActive]}>
                  Personalizada
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Duración (min)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="60"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Frecuencia</Text>
              <TextInput
                style={styles.input}
                value={frequency}
                onChangeText={setFrequency}
                placeholder="3x semana"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dificultad</Text>
            <View style={styles.difficultyButtons}>
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.difficultyButton, difficulty === level && styles.difficultyButtonActive]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text style={[styles.difficultyButtonText, difficulty === level && styles.difficultyButtonTextActive]}>
                    {level === 'beginner' ? 'Principiante' : level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Días de Entrenamiento</Text>
            <TouchableOpacity style={styles.addWorkoutButton} onPress={addWorkout}>
              <Plus size={20} color="#10B981" />
              <Text style={styles.addWorkoutText}>Agregar Día</Text>
            </TouchableOpacity>
          </View>

          {workouts.map((workout, workoutIndex) => (
            <View key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutTitle}>{workout.name}</Text>
                {workouts.length > 1 && (
                  <TouchableOpacity onPress={() => removeWorkout(workout.id)}>
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              {workout.exercises.map((exercise, exerciseIndex) => {
                const exerciseData = exercises.find(e => e.id === exercise.exerciseId);
                return (
                  <View key={exerciseIndex} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseNameInput}>
                        {exerciseData?.name || 'Ejercicio sin nombre'}
                      </Text>
                      <TouchableOpacity onPress={() => removeExerciseFromWorkout(workout.id, exerciseIndex)}>
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.exerciseParams}>
                      <View style={styles.paramGroup}>
                        <Text style={styles.paramLabel}>Series</Text>
                        <TextInput
                          style={styles.paramInput}
                          value={exercise.sets.toString()}
                          onChangeText={(value) => updateExercise(workout.id, exerciseIndex, 'sets', parseInt(value) || 0)}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.paramGroup}>
                        <Text style={styles.paramLabel}>Reps</Text>
                        <TextInput
                          style={styles.paramInput}
                          value={exercise.reps.toString()}
                          onChangeText={(value) => updateExercise(workout.id, exerciseIndex, 'reps', value)}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.paramGroup}>
                        <Text style={styles.paramLabel}>Peso (kg)</Text>
                        <TextInput
                          style={styles.paramInput}
                          value={exercise.weight?.toString() || '0'}
                          onChangeText={(value) => updateExercise(workout.id, exerciseIndex, 'weight', parseFloat(value) || 0)}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.paramGroup}>
                        <Text style={styles.paramLabel}>Descanso (s)</Text>
                        <TextInput
                          style={styles.paramInput}
                          value={exercise.rest?.toString() || '60'}
                          onChangeText={(value) => updateExercise(workout.id, exerciseIndex, 'rest', parseInt(value) || 60)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                );
              })}

              <TouchableOpacity 
                style={styles.addExerciseButton}
                onPress={() => addExerciseToWorkout(workout.id)}
              >
                <Plus size={16} color="#10B981" />
                <Text style={styles.addExerciseText}>Agregar Ejercicio</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#1F2937',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#10B981',
  },
  typeButtonText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#10B981',
  },
  difficultyButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyButtonTextActive: {
    color: '#fff',
  },
  addWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addWorkoutText: {
    color: '#10B981',
    fontWeight: '600',
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
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNameInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  exerciseParams: {
    flexDirection: 'row',
    gap: 8,
  },
  paramGroup: {
    flex: 1,
  },
  paramLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  paramInput: {
    backgroundColor: '#374151',
    borderRadius: 4,
    padding: 6,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 6,
    gap: 4,
  },
  addExerciseText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
});