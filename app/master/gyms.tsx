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
  Building2,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from 'lucide-react-native';
import { Stack } from 'expo-router';

interface Gym {
  id: string;
  name: string;
  location: string;
  clients: number;
  revenue: number;
  status: 'active' | 'pending' | 'inactive';
  lastPayment: string;
  plan: 'basic' | 'premium' | 'enterprise';
}

const mockGyms: Gym[] = [
  {
    id: '1',
    name: 'PowerGym Madrid',
    location: 'Madrid, España',
    clients: 245,
    revenue: 4500,
    status: 'active',
    lastPayment: '2025-09-01',
    plan: 'premium',
  },
  {
    id: '2',
    name: 'FitLife Barcelona',
    location: 'Barcelona, España',
    clients: 189,
    revenue: 3200,
    status: 'active',
    lastPayment: '2025-09-05',
    plan: 'basic',
  },
  {
    id: '3',
    name: 'Elite Fitness Valencia',
    location: 'Valencia, España',
    clients: 312,
    revenue: 5800,
    status: 'pending',
    lastPayment: '2025-08-01',
    plan: 'enterprise',
  },
  {
    id: '4',
    name: 'Muscle Zone Sevilla',
    location: 'Sevilla, España',
    clients: 156,
    revenue: 2900,
    status: 'active',
    lastPayment: '2025-09-10',
    plan: 'basic',
  },
  {
    id: '5',
    name: 'CrossFit Málaga',
    location: 'Málaga, España',
    clients: 98,
    revenue: 1800,
    status: 'pending',
    lastPayment: '2025-07-15',
    plan: 'basic',
  },
];

export default function GymsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');

  const filteredGyms = mockGyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gym.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || gym.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockGyms.reduce((acc, gym) => acc + gym.revenue, 0);
  const activeGyms = mockGyms.filter(g => g.status === 'active').length;
  const pendingPayments = mockGyms.filter(g => g.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'inactive': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return ['#8B5CF6', '#7C3AED'];
      case 'premium': return ['#3B82F6', '#2563EB'];
      case 'basic': return ['#6B7280', '#4B5563'];
      default: return ['#9CA3AF', '#6B7280'];
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Gimnasios',
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#fff',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.header}
        >
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{activeGyms}</Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>€{totalRevenue.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Ingresos/mes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>{pendingPayments}</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar gimnasio..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterRow}>
            {(['all', 'active', 'pending', 'inactive'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  selectedStatus === status && styles.filterButtonActive
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedStatus === status && styles.filterButtonTextActive
                ]}>
                  {status === 'all' ? 'Todos' : 
                   status === 'active' ? 'Activos' :
                   status === 'pending' ? 'Pendientes' : 'Inactivos'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.gymsList}>
          {filteredGyms.map((gym) => (
            <TouchableOpacity key={gym.id} style={styles.gymCard}>
              <View style={styles.gymHeader}>
                <View style={styles.gymIcon}>
                  <Building2 size={24} color="#fff" />
                </View>
                <View style={styles.gymInfo}>
                  <View style={styles.gymTitleRow}>
                    <Text style={styles.gymName}>{gym.name}</Text>
                    <LinearGradient
                      colors={getPlanBadgeColor(gym.plan) as any}
                      style={styles.planBadge}
                    >
                      <Text style={styles.planText}>
                        {gym.plan.charAt(0).toUpperCase() + gym.plan.slice(1)}
                      </Text>
                    </LinearGradient>
                  </View>
                  <Text style={styles.gymLocation}>{gym.location}</Text>
                </View>
              </View>

              <View style={styles.gymStats}>
                <View style={styles.gymStat}>
                  <Users size={16} color="#9CA3AF" />
                  <Text style={styles.gymStatText}>{gym.clients} clientes</Text>
                </View>
                <View style={styles.gymStat}>
                  <TrendingUp size={16} color="#9CA3AF" />
                  <Text style={styles.gymStatText}>€{gym.revenue}/mes</Text>
                </View>
              </View>

              <View style={styles.gymFooter}>
                <View style={styles.statusContainer}>
                  {gym.status === 'active' ? (
                    <CheckCircle size={16} color={getStatusColor(gym.status)} />
                  ) : (
                    <AlertCircle size={16} color={getStatusColor(gym.status)} />
                  )}
                  <Text style={[styles.statusText, { color: getStatusColor(gym.status) }]}>
                    {gym.status === 'active' ? 'Activo' :
                     gym.status === 'pending' ? 'Pago Pendiente' : 'Inactivo'}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
  },
  filterButtonActive: {
    backgroundColor: '#10B981',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  gymsList: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  gymCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  gymHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gymIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gymInfo: {
    flex: 1,
  },
  gymTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gymName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  planText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  gymLocation: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  gymStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  gymStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gymStatText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  gymFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.2)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});