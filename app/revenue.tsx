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
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  CreditCard,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Stack } from 'expo-router';

export default function RevenueScreen() {
  const monthlyData = [
    { month: 'Enero', revenue: 2400, clients: 48, avgPerClient: 50 },
    { month: 'Febrero', revenue: 2600, clients: 52, avgPerClient: 50 },
    { month: 'Marzo', revenue: 2800, clients: 56, avgPerClient: 50 },
    { month: 'Abril', revenue: 2500, clients: 50, avgPerClient: 50 },
    { month: 'Mayo', revenue: 2900, clients: 58, avgPerClient: 50 },
    { month: 'Junio', revenue: 3100, clients: 62, avgPerClient: 50 },
  ];

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const clientGrowth = ((currentMonth.clients - previousMonth.clients) / previousMonth.clients * 100).toFixed(1);

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Ingresos Mensuales',
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Ingresos de {currentMonth.month}</Text>
              <DollarSign size={24} color="#fff" />
            </View>
            <Text style={styles.summaryAmount}>€{currentMonth.revenue.toLocaleString()}</Text>
            <View style={styles.growthIndicator}>
              <TrendingUp size={16} color="#fff" />
              <Text style={styles.growthText}>+{revenueGrowth}% vs mes anterior</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Users size={20} color="#3B82F6" />
            <Text style={styles.metricValue}>{currentMonth.clients}</Text>
            <Text style={styles.metricLabel}>Clientes Activos</Text>
            <Text style={styles.metricGrowth}>+{clientGrowth}%</Text>
          </View>
          <View style={styles.metricCard}>
            <CreditCard size={20} color="#F59E0B" />
            <Text style={styles.metricValue}>€{currentMonth.avgPerClient}</Text>
            <Text style={styles.metricLabel}>Promedio por Cliente</Text>
            <Text style={styles.metricGrowth}>+0%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial Mensual</Text>
          <View style={styles.historyList}>
            {monthlyData.reverse().map((data, index) => (
              <View key={data.month} style={styles.historyItem}>
                <View style={styles.historyMonth}>
                  <Calendar size={16} color="#9CA3AF" />
                  <Text style={styles.historyMonthText}>{data.month}</Text>
                </View>
                <View style={styles.historyMetrics}>
                  <Text style={styles.historyRevenue}>€{data.revenue.toLocaleString()}</Text>
                  <Text style={styles.historyClients}>{data.clients} clientes</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proyecciones</Text>
          <View style={styles.projectionCard}>
            <Text style={styles.projectionTitle}>Próximo Mes (Julio)</Text>
            <Text style={styles.projectionAmount}>€3,250</Text>
            <Text style={styles.projectionDescription}>
              Basado en tendencia actual y nuevos registros
            </Text>
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
    marginBottom: 12,
  },
  growthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricGrowth: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
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
  historyList: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(156, 163, 175, 0.1)',
  },
  historyMonth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyMonthText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  historyMetrics: {
    alignItems: 'flex-end',
  },
  historyRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  historyClients: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  projectionCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  projectionTitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  projectionAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  projectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});