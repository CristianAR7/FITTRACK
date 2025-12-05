import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  AlertCircle,
  Building2,
  Calendar,
  CreditCard,
  Mail,
  Phone,
} from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function PendingPaymentsScreen() {
  const pendingGyms = [
    {
      id: 'gym_3',
      name: 'FitZone Premium',
      email: 'admin@fitzone.com',
      phone: '+34 666 777 888',
      daysOverdue: 15,
      amount: 299,
      lastPaymentDate: '2024-05-15',
    },
    {
      id: 'gym_7',
      name: 'PowerGym Elite',
      email: 'info@powergym.com',
      phone: '+34 777 888 999',
      daysOverdue: 8,
      amount: 199,
      lastPaymentDate: '2024-06-07',
    },
  ];

  const totalPendingAmount = pendingGyms.reduce((sum, gym) => sum + gym.amount, 0);

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Pagos Pendientes',
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Total Pendiente</Text>
              <AlertCircle size={24} color="#fff" />
            </View>
            <Text style={styles.summaryAmount}>€{totalPendingAmount}</Text>
            <Text style={styles.summarySubtext}>{pendingGyms.length} gimnasios con pagos pendientes</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gimnasios con Pagos Pendientes</Text>
          <View style={styles.gymsList}>
            {pendingGyms.map((gym) => (
              <View key={gym.id} style={styles.gymCard}>
                <LinearGradient
                  colors={['#7F1D1D', '#991B1B']}
                  style={styles.gymGradient}
                >
                  <View style={styles.gymHeader}>
                    <View style={styles.gymAvatar}>
                      <Building2 size={24} color="#fff" />
                    </View>
                    <View style={styles.gymInfo}>
                      <Text style={styles.gymName}>{gym.name}</Text>
                      <View style={styles.gymContact}>
                        <Mail size={14} color="#9CA3AF" />
                        <Text style={styles.gymEmail}>{gym.email}</Text>
                      </View>
                      <View style={styles.gymContact}>
                        <Phone size={14} color="#9CA3AF" />
                        <Text style={styles.gymPhone}>{gym.phone}</Text>
                      </View>
                    </View>
                    <View style={styles.urgencyBadge}>
                      <Text style={styles.urgencyText}>
                        {gym.daysOverdue > 10 ? 'URGENTE' : 'PENDIENTE'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.gymMetrics}>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>€{gym.amount}</Text>
                      <Text style={styles.metricLabel}>Importe</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{gym.daysOverdue}</Text>
                      <Text style={styles.metricLabel}>Días de retraso</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>
                        {new Date(gym.lastPaymentDate).toLocaleDateString('es-ES')}
                      </Text>
                      <Text style={styles.metricLabel}>Último pago</Text>
                    </View>
                  </View>

                  <View style={styles.gymActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Mail size={16} color="#fff" />
                      <Text style={styles.actionButtonText}>Enviar Recordatorio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.callButton]}>
                      <Phone size={16} color="#fff" />
                      <Text style={styles.actionButtonText}>Llamar</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Masivas</Text>
          <View style={styles.massActionsCard}>
            <TouchableOpacity style={styles.massActionButton}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.massActionGradient}
              >
                <Mail size={20} color="#fff" />
                <Text style={styles.massActionText}>Enviar Recordatorio a Todos</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.massActionButton}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.massActionGradient}
              >
                <AlertCircle size={20} color="#fff" />
                <Text style={styles.massActionText}>Suspender Servicios</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  },
  summaryCard: {
    borderRadius: 16,
    padding: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  summarySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  gymsList: {
    gap: 16,
  },
  gymCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gymGradient: {
    padding: 20,
  },
  gymHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gymAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gymInfo: {
    flex: 1,
  },
  gymName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  gymContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  gymEmail: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  gymPhone: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  urgencyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  gymMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  gymActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  callButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  massActionsCard: {
    gap: 12,
  },
  massActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  massActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  massActionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});