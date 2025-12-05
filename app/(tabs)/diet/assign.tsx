import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search,
  User,
  Check,
  Apple,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-context';
import { useGymData } from '@/hooks/gym-data-context';
import { router, Stack } from 'expo-router';

export default function AssignDietScreen() {
  const { authState } = useAuth();
  const { clients, dietPlans, assignDietToClient } = useGymData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (selectedClient && selectedDiet) {
      assignDietToClient(selectedClient, selectedDiet);
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Asignar Dieta',
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#fff',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seleccionar Cliente</Text>
          
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cliente..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.clientsList}>
            {filteredClients.map((client) => (
              <TouchableOpacity
                key={client.id}
                style={[
                  styles.clientCard,
                  selectedClient === client.id && styles.selectedCard
                ]}
                onPress={() => setSelectedClient(client.id)}
              >
                <View style={styles.clientInfo}>
                  <View style={styles.clientAvatar}>
                    <User size={20} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                  </View>
                </View>
                {selectedClient === client.id && (
                  <Check size={20} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seleccionar Plan de Dieta</Text>
          
          <View style={styles.dietsList}>
            {dietPlans.map((diet) => (
              <TouchableOpacity
                key={diet.id}
                style={[
                  styles.dietCard,
                  selectedDiet === diet.id && styles.selectedCard
                ]}
                onPress={() => setSelectedDiet(diet.id)}
              >
                <View style={styles.dietHeader}>
                  <Apple size={20} color="#F59E0B" />
                  <View style={styles.dietInfo}>
                    <Text style={styles.dietName}>{diet.name}</Text>
                    <Text style={styles.dietType}>
                      {diet.type === 'generic' ? 'Plan Genérico' : 'Plan Personalizado'}
                    </Text>
                  </View>
                  {selectedDiet === diet.id && (
                    <Check size={20} color="#10B981" />
                  )}
                </View>
                <Text style={styles.dietDescription}>{diet.description}</Text>
                <View style={styles.dietStats}>
                  <Text style={styles.dietStat}>
                    {diet.dailyCalories} kcal/día
                  </Text>
                  <Text style={styles.dietStat}>
                    {diet.meals.length} comidas
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedClient && selectedDiet && (
          <TouchableOpacity 
            style={styles.assignButton}
            onPress={handleAssign}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.assignButtonGradient}
            >
              <Text style={styles.assignButtonText}>Asignar Dieta</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
  },
  clientsList: {
    gap: 12,
  },
  clientCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  clientEmail: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  dietsList: {
    gap: 12,
  },
  dietCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  dietHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dietInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dietName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dietType: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dietDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  dietStats: {
    flexDirection: 'row',
    gap: 16,
  },
  dietStat: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  assignButton: {
    margin: 20,
    marginTop: 0,
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
});