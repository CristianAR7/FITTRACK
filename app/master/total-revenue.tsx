import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
} from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function TotalRevenueScreen() {
  const monthlyData = [
    { month: 'Enero', revenue: 24500, gyms: 12 },
    { month: 'Febrero', revenue: 26800, gyms: 12 },
    { month: 'Marzo', revenue: 28200, gyms: 13 },
    { month: 'Abril', revenue: 27500, gyms: 13 },
    { month: 'Mayo', revenue: 29900, gyms: 14 },
    { month: 'Junio', revenue: 31200, gyms: 14 },
  ];

  const currentMonth = monthlyData[monthlyData.length - 1];
  const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0);
  const avgRevenuePerGym = currentMonth.revenue / currentMonth.gyms;

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Ingresos Totales',
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Ingresos Totales (6 meses)</Text>
              <DollarSign size={24} color="#fff" />
            </View>
            <Text style={styles.summaryAmount}>€{totalRevenue.toLocaleString()}</Text>
            <View style={styles.growthIndicator}>
              <TrendingUp size={16} color="#fff" />
              <Text style={styles.growthText}>Crecimiento sostenido</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Building2 size={20} color="#10B981" />
            <Text style={styles.metricValue}>{currentMonth.gyms}</Text>
            <Text style={styles.metricLabel}>Gimnasios Activos</Text>
          </View>
          <View style={styles.metricCard}>
            <DollarSign size={20} color="#F59E0B" />
            <Text style={styles.metricValue}>€{Math.round(avgRevenuePerGym)}</Text>
            <Text style={styles.metricLabel}>Promedio por Gimnasio</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desglose Mensual</Text>
          <View style={styles.historyList}>
            {monthlyData.reverse().map((data, index) => (
              <View key={data.month} style={styles.historyItem}>
                <View style={styles.historyMonth}>
                  <Calendar size={16} color="#9CA3AF" />
                  <Text style={styles.historyMonthText}>{data.month}</Text>
                </View>
                <View style={styles.historyMetrics}>
                  <Text style={styles.historyRevenue}>€{data.revenue.toLocaleString()}</Text>
                  <Text style={styles.historyGyms}>{data.gyms} gimnasios</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análisis</Text>
          <View style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>Rendimiento General</Text>
            <Text style={styles.analysisText}>
              Los ingresos han mostrado un crecimiento constante del 5.2% mensual promedio. 
              La incorporación de nuevos gimnasios ha contribuido significativamente al aumento de ingresos.
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
    color: '#3B82F6',
  },
  historyGyms: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  analysisCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
});