import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/hooks/auth-context';
import { useGymData } from '@/hooks/gym-data-context';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { profile, signOut } = useAuth();
  const { gym, stats, loading, refreshData } = useGymData();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-400 mt-4">Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="px-6 pt-12 pb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-sm">Bienvenido de vuelta</Text>
            <Text className="text-white text-2xl font-bold">
              {profile?.full_name || 'Usuario'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={signOut}
            className="bg-gray-800 px-4 py-2 rounded-lg"
          >
            <Text className="text-gray-300">Salir</Text>
          </TouchableOpacity>
        </View>

        {gym && (
          <View className="mt-4 bg-gray-800 p-4 rounded-lg">
            <Text className="text-gray-400 text-xs">Gimnasio</Text>
            <Text className="text-white text-lg font-semibold">{gym.name}</Text>
          </View>
        )}
      </View>

      {/* Stats Cards */}
      <View className="px-6">
        <Text className="text-white text-xl font-bold mb-4">
          Resumen General
        </Text>

        <View className="flex-row flex-wrap -mx-2">
          {/* Total Clientes */}
          <View className="w-1/2 px-2 mb-4">
            <View className="bg-blue-600 p-4 rounded-lg">
              <Text className="text-blue-100 text-xs">Total Clientes</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                {stats.totalClients}
              </Text>
            </View>
          </View>

          {/* Clientes Activos */}
          <View className="w-1/2 px-2 mb-4">
            <View className="bg-green-600 p-4 rounded-lg">
              <Text className="text-green-100 text-xs">Activos</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                {stats.activeClients}
              </Text>
            </View>
          </View>

          {/* Rutinas */}
          <View className="w-1/2 px-2 mb-4">
            <View className="bg-purple-600 p-4 rounded-lg">
              <Text className="text-purple-100 text-xs">Rutinas</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                {stats.totalRoutines}
              </Text>
            </View>
          </View>

          {/* Dietas */}
          <View className="w-1/2 px-2 mb-4">
            <View className="bg-orange-600 p-4 rounded-lg">
              <Text className="text-orange-100 text-xs">Dietas</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                {stats.totalDiets}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 mt-6 mb-8">
        <Text className="text-white text-xl font-bold mb-4">
          Acciones Rápidas
        </Text>

        <View className="space-y-3">
          <TouchableOpacity
            className="bg-gray-800 p-4 rounded-lg flex-row justify-between items-center"
            onPress={() => router.push('/(tabs)/clients')}
          >
            <View>
              <Text className="text-white font-semibold">
                Ver Clientes
              </Text>
              <Text className="text-gray-400 text-xs">
                Gestiona tus {stats.totalClients} clientes
              </Text>
            </View>
            <Text className="text-blue-500 text-2xl">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-800 p-4 rounded-lg flex-row justify-between items-center"
            onPress={() => router.push('/(tabs)/routines')}
          >
            <View>
              <Text className="text-white font-semibold">
                Rutinas
              </Text>
              <Text className="text-gray-400 text-xs">
                {stats.totalRoutines} rutinas creadas
              </Text>
            </View>
            <Text className="text-blue-500 text-2xl">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-800 p-4 rounded-lg flex-row justify-between items-center"
            onPress={() => router.push('/(tabs)/diets')}
          >
            <View>
              <Text className="text-white font-semibold">
                Dietas
              </Text>
              <Text className="text-gray-400 text-xs">
                {stats.totalDiets} planes nutricionales
              </Text>
            </View>
            <Text className="text-blue-500 text-2xl">→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
