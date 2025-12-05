import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User as UserIcon, 
  Check,
  Search,
  ArrowLeft,
  Dumbbell,
  Clock,
  Calendar,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-context';
import { useGymData } from '@/hooks/gym-data-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { User } from '@/types/gym';

export default function AssignRoutineScreen() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const { authState } = useAuth();
  const { routines, clients, assignRoutineToClient } = useGymData();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const routine = routines.find(r => r.id === routineId);
  const gymClients = clients.filter(client => client.gymId === authState.gymId);
  
  const filteredClients = gymClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleAssignRoutine = () => {
    if (selectedClients.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un cliente para asignar la rutina');
      return;
    }

    if (!routine) {
      Alert.alert('Error', 'No se encontró la rutina seleccionada');
      return;
    }

    selectedClients.forEach(clientId => {
      assignRoutineToClient(clientId, routine.id);
    });

    Alert.alert(
      'Rutina Asignada',
      `La rutina "${routine.name}" ha sido asignada a ${selectedClients.length} cliente${selectedClients.length > 1 ? 's' : ''}.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderClientCard = ({ item }: { item: User }) => {
    const isSelected = selectedClients.includes(item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.clientCard, isSelected && styles.clientCardSelected]}
        onPress={() => toggleClientSelection(item.id)}
      >
        <LinearGradient
          colors={isSelected ? ['#10B981', '#059669'] : ['#1F2937', '#111827']}
          style={styles.clientGradient}
        >
          <View style={styles.clientHeader}>
            <View style={styles.clientInfo}>
              <View style={styles.clientAvatar}>
                <UserIcon size={20} color={isSelected ? '#fff' : '#9CA3AF'} />
              </View>
              <View style={styles.clientDetails}>
                <Text style={[styles.clientName, isSelected && styles.clientNameSelected]}>
                  {item.name}
                </Text>
                <Text style={[styles.clientEmail, isSelected && styles.clientEmailSelected]}>
                  {item.email}
                </Text>
              </View>
            </View>
            
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Check size={16} color="#fff" />}
            </View>
          </View>
          
          <View style={styles.clientStats}>
            <Text style={[styles.clientStat, isSelected && styles.clientStatSelected]}>
              Miembro desde: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (!routine) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Rutina no encontrada' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo encontrar la rutina seleccionada</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const totalExercises = routine.workouts.reduce((acc, w) => acc + w.exercises.length, 0);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Asignar Rutina',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content}>
        {/* Routine Info */}
        <View style={styles.routineInfo}>
          <LinearGradient
            colors={['#1F2937', '#111827']}
            style={styles.routineCard}
          >
            <Text style={styles.routineTitle}>{routine.name}</Text>
            <Text style={styles.routineDescription}>{routine.description}</Text>
            
            <View style={styles.routineStats}>
              <View style={styles.routineStat}>
                <Clock size={14} color="#9CA3AF" />
                <Text style={styles.routineStatText}>{routine.duration} min</Text>
              </View>
              <View style={styles.routineStat}>
                <Calendar size={14} color="#9CA3AF" />
                <Text style={styles.routineStatText}>{routine.frequency}</Text>
              </View>
              <View style={styles.routineStat}>
                <Dumbbell size={14} color="#9CA3AF" />
                <Text style={styles.routineStatText}>{totalExercises} ejercicios</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Client Selection */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Seleccionar Clientes</Text>
          <Text style={styles.sectionSubtitle}>
            Elige los clientes a los que quieres asignar esta rutina
          </Text>
          
          {selectedClients.length > 0 && (
            <View style={styles.selectionSummary}>
              <Text style={styles.selectionText}>
                {selectedClients.length} cliente{selectedClients.length > 1 ? 's' : ''} seleccionado{selectedClients.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {filteredClients.length === 0 ? (
          <View style={styles.emptyState}>
            <UserIcon size={48} color="#6B7280" />
            <Text style={styles.emptyStateTitle}>No hay clientes</Text>
            <Text style={styles.emptyStateText}>
              No tienes clientes registrados en tu gimnasio para asignar rutinas
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredClients}
            renderItem={renderClientCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.clientsList}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Assign Button */}
      {selectedClients.length > 0 && (
        <View style={styles.assignButtonContainer}>
          <TouchableOpacity 
            style={styles.assignButton}
            onPress={handleAssignRoutine}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.assignButtonGradient}
            >
              <Check size={20} color="#fff" />
              <Text style={styles.assignButtonText}>
                Asignar a {selectedClients.length} cliente{selectedClients.length > 1 ? 's' : ''}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
  },
  routineInfo: {
    padding: 16,
  },
  routineCard: {
    padding: 16,
    borderRadius: 12,
  },
  routineTitle: {
    fontSize: 20,
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
  clientSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  selectionSummary: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectionText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  clientsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  clientCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  clientCardSelected: {
    transform: [{ scale: 0.98 }],
  },
  clientGradient: {
    padding: 16,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  clientNameSelected: {
    color: '#fff',
  },
  clientEmail: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  clientEmailSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  clientStats: {
    marginTop: 8,
  },
  clientStat: {
    fontSize: 12,
    color: '#6B7280',
  },
  clientStatSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  assignButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  assignButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  assignButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});