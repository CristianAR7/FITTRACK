import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useGymData } from '@/hooks/gym-data-context';
import { router } from 'expo-router';

export default function ClientsScreen() {
  const { clients, loading, refreshData } = useGymData();
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
        <Text className="text-gray-400 mt-4">Cargando clientes...</Text>
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
        <Text className="text-white text-3xl font-bold">Clientes</Text>
        <Text className="text-gray-400 mt-1">
          {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'} en total
        </Text>
      </View>

      {/* Lista de Clientes */}
      <View className="px-6 pb-6">
        {clients.length === 0 ? (
          <View className="bg-gray-800 p-8 rounded-lg items-center">
            <Text className="text-gray-400 text-center">
              No hay clientes registrados aún
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-2">
              Los clientes aparecerán aquí cuando se registren
            </Text>
          </View>
        ) : (
          <View className="space-y-3">
            {clients.map((client) => (
              <TouchableOpacity
                key={client.id}
                className="bg-gray-800 p-4 rounded-lg"
                onPress={() => router.push(`/(tabs)/clients/${client.id}`)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-lg">
                      {client.profile.full_name || 'Sin nombre'}
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1">
                      {client.profile.email}
                    </Text>

                    {/* Status Badge */}
                    <View className="flex-row mt-2">
                      <View
                        className={`px-3 py-1 rounded-full ${
                          client.status === 'active'
                            ? 'bg-green-600'
                            : client.status === 'inactive'
                            ? 'bg-gray-600'
                            : 'bg-red-600'
                        }`}
                      >
                        <Text className="text-white text-xs font-medium">
                          {client.status === 'active'
                            ? 'Activo'
                            : client.status === 'inactive'
                            ? 'Inactivo'
                            : 'Suspendido'}
                        </Text>
                      </View>
                    </View>

                    {/* Fechas de membresía */}
                    {client.membership_start && (
                      <View className="mt-2">
                        <Text className="text-gray-500 text-xs">
                          Inicio: {new Date(client.membership_start).toLocaleDateString('es-ES')}
                        </Text>
                        {client.membership_end && (
                          <Text className="text-gray-500 text-xs">
                            Fin: {new Date(client.membership_end).toLocaleDateString('es-ES')}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>

                  <View className="ml-4">
                    <Text className="text-blue-500 text-2xl">→</Text>
                  </View>
                </View>

                {/* Notas si existen */}
                {client.notes && (
                  <View className="mt-3 pt-3 border-t border-gray-700">
                    <Text className="text-gray-400 text-xs">
                      {client.notes}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Estadísticas */}
      {clients.length > 0 && (
        <View className="px-6 pb-6">
          <View className="bg-gray-800 p-4 rounded-lg">
            <Text className="text-white font-semibold mb-3">Estadísticas</Text>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Activos:</Text>
              <Text className="text-green-400 font-bold">
                {clients.filter(c => c.status === 'active').length}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Inactivos:</Text>
              <Text className="text-gray-400 font-bold">
                {clients.filter(c => c.status === 'inactive').length}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-400">Suspendidos:</Text>
              <Text className="text-red-400 font-bold">
                {clients.filter(c => c.status === 'suspended').length}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
