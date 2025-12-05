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
  User,
  Mail,
  Calendar,
  Ruler,
  Activity,
  LogOut,
  Building2,
  CreditCard,
  Settings,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-context';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { authState, logout } = useAuth();
  const isGym = authState.role === 'gym';
  const isMaster = authState.role === 'master';

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (isMaster) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.header}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>M</Text>
          </View>
          <Text style={styles.profileName}>Master Admin</Text>
          <Text style={styles.profileEmail}>admin@empresa.com</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileType}>Cuenta Master</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dashboard Empresarial</Text>
            <View style={styles.dashboardGrid}>
              <TouchableOpacity 
                style={styles.dashboardCard}
                onPress={() => router.push('/master/gyms')}
              >
                <Building2 size={24} color="#10B981" />
                <Text style={styles.dashboardValue}>12</Text>
                <Text style={styles.dashboardLabel}>Gimnasios Activos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dashboardCard}
                onPress={() => router.push('/master/total-revenue')}
              >
                <CreditCard size={24} color="#3B82F6" />
                <Text style={styles.dashboardValue}>€24,500</Text>
                <Text style={styles.dashboardLabel}>Ingresos Totales</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dashboardCard}
                onPress={() => router.push('/master/pending-payments')}
              >
                <Activity size={24} color="#F59E0B" />
                <Text style={styles.dashboardValue}>2</Text>
                <Text style={styles.dashboardLabel}>Pagos Pendientes</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/master/churn-rate')}
            >
              <Activity size={20} color="#9CA3AF" />
              <Text style={styles.actionButtonText}>Tasa de Rotación</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Settings size={20} color="#9CA3AF" />
              <Text style={styles.actionButtonText}>Configuración</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.logoutButtonGradient}
              >
                <LogOut size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }



  const profileData = isGym ? {
    name: authState.gym?.name || 'Gimnasio',
    email: authState.gym?.email || '',
    type: 'Cuenta de Gimnasio',
    subscription: authState.gym?.subscriptionActive ? 'Activa' : 'Inactiva',
  } : {
    name: authState.user?.name || 'Usuario',
    email: authState.user?.email || '',
    type: 'Cuenta de Cliente',
    gym: authState.gym?.name || 'Sin gimnasio',
    height: authState.user?.height || 0,
    weight: authState.user?.currentWeight || 0,
    target: authState.user?.targetWeight || 0,
    activity: authState.user?.activityLevel || 'moderate',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.header}
      >
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>
            {profileData.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{profileData.name}</Text>
        <Text style={styles.profileEmail}>{profileData.email}</Text>
        <View style={styles.profileBadge}>
          <Text style={styles.profileType}>{profileData.type}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {isGym ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información del Gimnasio</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Building2 size={20} color="#9CA3AF" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nombre</Text>
                    <Text style={styles.infoValue}>{profileData.name}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Mail size={20} color="#9CA3AF" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{profileData.email}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <CreditCard size={20} color="#9CA3AF" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Suscripción</Text>
                    <Text style={[
                      styles.infoValue,
                      { color: profileData.subscription === 'Activa' ? '#10B981' : '#EF4444' }
                    ]}>
                      {profileData.subscription}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información Personal</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <User size={20} color="#9CA3AF" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nombre</Text>
                    <Text style={styles.infoValue}>{profileData.name}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Mail size={20} color="#9CA3AF" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{profileData.email}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Building2 size={20} color="#9CA3AF" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Gimnasio</Text>
                    <Text style={styles.infoValue}>{profileData.gym}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Métricas</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Ruler size={20} color="#10B981" />
                  <Text style={styles.metricValue}>{profileData.height} cm</Text>
                  <Text style={styles.metricLabel}>Altura</Text>
                </View>
                <View style={styles.metricCard}>
                  <Activity size={20} color="#3B82F6" />
                  <Text style={styles.metricValue}>{profileData.weight} kg</Text>
                  <Text style={styles.metricLabel}>Peso Actual</Text>
                </View>
                <View style={styles.metricCard}>
                  <Calendar size={20} color="#F59E0B" />
                  <Text style={styles.metricValue}>{profileData.target} kg</Text>
                  <Text style={styles.metricLabel}>Objetivo</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          {isGym && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/revenue')}
            >
              <CreditCard size={20} color="#9CA3AF" />
              <Text style={styles.actionButtonText}>Ingresos Mensuales</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton}>
            <Settings size={20} color="#9CA3AF" />
            <Text style={styles.actionButtonText}>Configuración</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.logoutButtonGradient}
            >
              <LogOut size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 30,
    alignItems: 'center',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  profileBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileType: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dashboardCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  dashboardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  dashboardLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});