import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingDown,
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function ChurnRateScreen() {
  const churnData = [
    { month: 'Enero', churnRate: 8.5, newGyms: 2, lostGyms: 1 },
    { month: 'Febrero', churnRate: 5.2, newGyms: 1, lostGyms: 0 },
    { month: 'Marzo', churnRate: 7.1, newGyms: 2, lostGyms: 1 },
    { month: 'Abril', churnRate: 3.8, newGyms: 1, lostGyms: 0 },
    { month: 'Mayo', churnRate: 6.4, newGyms: 2, lostGyms: 1 },
    { month: 'Junio', churnRate: 4.2, newGyms: 1, lostGyms: 0 },
  ];

  const currentMonth = churnData[churnData.length - 1];
  const avgChurnRate = churnData.reduce((sum, data) => sum + data.churnRate, 0) / churnData.length;
  const totalNewGyms = churnData.reduce((sum, data) => sum + data.newGyms, 0);
  const totalLostGyms = churnData.reduce((sum, data) => sum + data.lostGyms, 0);

  const riskGyms = [
    {
      name: 'SportCenter Basic',
      riskLevel: 'Alto',
      lastPayment: '2024-05-20',
      clientsLost: 8,
      reason: 'Reducción de clientes',
    },
    {
      name: 'FitLife Studio',
      riskLevel: 'Medio',
      lastPayment: '2024-06-01',
      clientsLost: 3,
      reason: 'Competencia local',
    },
  ];

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Tasa de Rotación',
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={currentMonth.churnRate > avgChurnRate ? ['#F59E0B', '#D97706'] : ['#10B981', '#059669']}
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Tasa de Rotación Actual</Text>
              {currentMonth.churnRate > avgChurnRate ? (
                <TrendingUp size={24} color="#fff" />
              ) : (
                <TrendingDown size={24} color="#fff" />
              )}
            </View>
            <Text style={styles.summaryAmount}>{currentMonth.churnRate.toFixed(1)}%</Text>
            <Text style={styles.summarySubtext}>
              {currentMonth.churnRate > avgChurnRate ? 'Por encima' : 'Por debajo'} del promedio ({avgChurnRate.toFixed(1)}%)
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.metricValue}>{totalNewGyms}</Text>
            <Text style={styles.metricLabel}>Nuevos Gimnasios (6m)</Text>
          </View>
          <View style={styles.metricCard}>
            <AlertTriangle size={20} color="#EF4444" />
            <Text style={styles.metricValue}>{totalLostGyms}</Text>
            <Text style={styles.metricLabel}>Gimnasios Perdidos (6m)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Rotación</Text>
          <View style={styles.historyList}>
            {churnData.reverse().map((data, index) => (
              <View key={data.month} style={styles.historyItem}>
                <View style={styles.historyMonth}>
                  <Calendar size={16} color="#9CA3AF" />
                  <Text style={styles.historyMonthText}>{data.month}</Text>
                </View>
                <View style={styles.historyMetrics}>
                  <Text style={[
                    styles.historyChurnRate,
                    { color: data.churnRate > avgChurnRate ? '#EF4444' : '#10B981' }
                  ]}>
                    {data.churnRate.toFixed(1)}%
                  </Text>
                  <Text style={styles.historyDetails}>
                    +{data.newGyms} / -{data.lostGyms}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gimnasios en Riesgo</Text>
          <View style={styles.riskList}>
            {riskGyms.map((gym, index) => (
              <View key={index} style={styles.riskCard}>
                <View style={styles.riskHeader}>
                  <Text style={styles.riskGymName}>{gym.name}</Text>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: gym.riskLevel === 'Alto' ? '#EF4444' : '#F59E0B' }
                  ]}>
                    <Text style={styles.riskBadgeText}>Riesgo {gym.riskLevel}</Text>
                  </View>
                </View>
                <View style={styles.riskDetails}>
                  <View style={styles.riskDetail}>
                    <Users size={14} color="#9CA3AF" />
                    <Text style={styles.riskDetailText}>{gym.clientsLost} clientes perdidos</Text>
                  </View>
                  <View style={styles.riskDetail}>
                    <Calendar size={14} color="#9CA3AF" />
                    <Text style={styles.riskDetailText}>
                      Último pago: {new Date(gym.lastPayment).toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                  <Text style={styles.riskReason}>Motivo: {gym.reason}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análisis y Recomendaciones</Text>
          <View style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>Tendencias Identificadas</Text>
            <Text style={styles.analysisText}>
              • La tasa de rotación se mantiene estable en un promedio del {avgChurnRate.toFixed(1)}%{"\n"}
              • Los gimnasios con mayor riesgo muestran pérdida de clientes{"\n"}
              • Se recomienda implementar programas de retención{"\n"}
              • Seguimiento mensual de métricas clave
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
    marginBottom: 8,
  },
  summarySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
  historyChurnRate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyDetails: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  riskList: {
    gap: 12,
  },
  riskCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskGymName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  riskDetails: {
    gap: 6,
  },
  riskDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  riskDetailText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  riskReason: {
    fontSize: 12,
    color: '#F59E0B',
    fontStyle: 'italic',
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