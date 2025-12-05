import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp,
  TrendingDown,
  Plus,
  Weight,
  Ruler,
  Calendar,
  Target,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-context';
import { useGymData } from '@/hooks/gym-data-context';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { authState } = useAuth();
  const { weightRecords, measurements, addWeightRecord, addMeasurement } = useGymData();
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showMeasurementsForm, setShowMeasurementsForm] = useState(false);
  
  const [weightForm, setWeightForm] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
  });
  
  const [measurementsForm, setMeasurementsForm] = useState({
    chest: '',
    waist: '',
    hips: '',
    arms: '',
  });

  const latestWeight = weightRecords[weightRecords.length - 1];
  const previousWeight = weightRecords[weightRecords.length - 2];
  const weightChange = latestWeight && previousWeight 
    ? latestWeight.weight - previousWeight.weight 
    : 0;

  const latestMeasurements = measurements[measurements.length - 1];

  const handleSaveWeight = async () => {
    if (!weightForm.weight || !authState.userId) return;
    
    await addWeightRecord({
      userId: authState.userId,
      weight: parseFloat(weightForm.weight),
      bodyFat: weightForm.bodyFat ? parseFloat(weightForm.bodyFat) : undefined,
      muscleMass: weightForm.muscleMass ? parseFloat(weightForm.muscleMass) : undefined,
      date: new Date().toISOString(),
      bmi: parseFloat(weightForm.weight) / Math.pow((authState.user?.height || 170) / 100, 2),
    });
    
    setWeightForm({ weight: '', bodyFat: '', muscleMass: '' });
    setShowWeightForm(false);
  };

  const handleSaveMeasurements = async () => {
    if (!authState.userId) return;
    
    await addMeasurement({
      userId: authState.userId,
      date: new Date().toISOString(),
      chest: measurementsForm.chest ? parseFloat(measurementsForm.chest) : undefined,
      waist: measurementsForm.waist ? parseFloat(measurementsForm.waist) : undefined,
      hips: measurementsForm.hips ? parseFloat(measurementsForm.hips) : undefined,
      arms: measurementsForm.arms ? parseFloat(measurementsForm.arms) : undefined,
    });
    
    setMeasurementsForm({ chest: '', waist: '', hips: '', arms: '' });
    setShowMeasurementsForm(false);
  };

  // Simple chart data for weight progress
  const chartData = weightRecords.slice(-7).map(record => ({
    date: new Date(record.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    weight: record.weight,
  }));

  const maxWeight = Math.max(...chartData.map(d => d.weight), 1);
  const minWeight = Math.min(...chartData.map(d => d.weight), 0);
  const chartHeight = 200;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.currentWeight}>
              {latestWeight?.weight || '--'} kg
            </Text>
            <Text style={styles.weightLabel}>Peso Actual</Text>
          </View>
          
          <View style={styles.weightChange}>
            {weightChange !== 0 && (
              <>
                {weightChange > 0 ? (
                  <TrendingUp size={20} color="#EF4444" />
                ) : (
                  <TrendingDown size={20} color="#10B981" />
                )}
                <Text style={[
                  styles.changeText,
                  { color: weightChange > 0 ? '#EF4444' : '#10B981' }
                ]}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.targetInfo}>
          <Target size={16} color="#9CA3AF" />
          <Text style={styles.targetText}>
            Objetivo: {authState.user?.targetWeight || '--'} kg
          </Text>
          {latestWeight && authState.user?.targetWeight && (
            <Text style={styles.remainingText}>
              (Faltan {Math.abs(latestWeight.weight - authState.user.targetWeight).toFixed(1)} kg)
            </Text>
          )}
        </View>
      </LinearGradient>

      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Evolución del Peso</Text>
          <View style={styles.chart}>
            {chartData.map((data, index) => {
              const barHeight = ((data.weight - minWeight) / (maxWeight - minWeight)) * chartHeight;
              return (
                <View key={index} style={styles.chartBar}>
                  <Text style={styles.chartValue}>{data.weight}</Text>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar,
                        { height: barHeight || 10 }
                      ]} 
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.date}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.statsGrid}>
        {latestWeight?.bodyFat && (
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{latestWeight.bodyFat}%</Text>
            <Text style={styles.statLabel}>Grasa Corporal</Text>
          </View>
        )}
        {latestWeight?.muscleMass && (
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{latestWeight.muscleMass} kg</Text>
            <Text style={styles.statLabel}>Masa Muscular</Text>
          </View>
        )}
        {latestWeight?.bmi && (
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{latestWeight.bmi.toFixed(1)}</Text>
            <Text style={styles.statLabel}>IMC</Text>
          </View>
        )}
      </View>

      {latestMeasurements && (
        <View style={styles.measurementsContainer}>
          <Text style={styles.sectionTitle}>Últimas Medidas</Text>
          <View style={styles.measurementsGrid}>
            {latestMeasurements.chest && (
              <View style={styles.measurementItem}>
                <Text style={styles.measurementValue}>{latestMeasurements.chest}</Text>
                <Text style={styles.measurementLabel}>Pecho (cm)</Text>
              </View>
            )}
            {latestMeasurements.waist && (
              <View style={styles.measurementItem}>
                <Text style={styles.measurementValue}>{latestMeasurements.waist}</Text>
                <Text style={styles.measurementLabel}>Cintura (cm)</Text>
              </View>
            )}
            {latestMeasurements.arms && (
              <View style={styles.measurementItem}>
                <Text style={styles.measurementValue}>{latestMeasurements.arms}</Text>
                <Text style={styles.measurementLabel}>Brazos (cm)</Text>
              </View>
            )}
            {latestMeasurements.hips && (
              <View style={styles.measurementItem}>
                <Text style={styles.measurementValue}>{latestMeasurements.hips}</Text>
                <Text style={styles.measurementLabel}>Caderas (cm)</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowWeightForm(!showWeightForm)}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.actionButtonGradient}
          >
            <Weight size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Registrar Peso</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowMeasurementsForm(!showMeasurementsForm)}
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.actionButtonGradient}
          >
            <Ruler size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Registrar Medidas</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {showWeightForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Nuevo Registro de Peso</Text>
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor="#6B7280"
            value={weightForm.weight}
            onChangeText={(text) => setWeightForm({...weightForm, weight: text})}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="% Grasa Corporal (opcional)"
            placeholderTextColor="#6B7280"
            value={weightForm.bodyFat}
            onChangeText={(text) => setWeightForm({...weightForm, bodyFat: text})}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Masa Muscular kg (opcional)"
            placeholderTextColor="#6B7280"
            value={weightForm.muscleMass}
            onChangeText={(text) => setWeightForm({...weightForm, muscleMass: text})}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveWeight}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      )}

      {showMeasurementsForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Nuevas Medidas Corporales</Text>
          <TextInput
            style={styles.input}
            placeholder="Pecho (cm)"
            placeholderTextColor="#6B7280"
            value={measurementsForm.chest}
            onChangeText={(text) => setMeasurementsForm({...measurementsForm, chest: text})}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Cintura (cm)"
            placeholderTextColor="#6B7280"
            value={measurementsForm.waist}
            onChangeText={(text) => setMeasurementsForm({...measurementsForm, waist: text})}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Caderas (cm)"
            placeholderTextColor="#6B7280"
            value={measurementsForm.hips}
            onChangeText={(text) => setMeasurementsForm({...measurementsForm, hips: text})}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Brazos (cm)"
            placeholderTextColor="#6B7280"
            value={measurementsForm.arms}
            onChangeText={(text) => setMeasurementsForm({...measurementsForm, arms: text})}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeasurements}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentWeight: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  weightLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  weightChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  remainingText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  chartContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 250,
    paddingTop: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  chartValue: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  barContainer: {
    flex: 1,
    width: '80%',
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    minHeight: 10,
  },
  chartLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  measurementsContainer: {
    padding: 20,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measurementItem: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  measurementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  measurementLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#1F2937',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});