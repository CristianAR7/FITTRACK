import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@/hooks/auth-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert(
        'Error de Login',
        error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-900"
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo/Título */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-white text-center mb-2">
            FitTrack
          </Text>
          <Text className="text-gray-400 text-center">
            Gestiona tu gimnasio desde cualquier lugar
          </Text>
        </View>

        {/* Formulario */}
        <View className="space-y-4">
          {/* Email */}
          <View>
            <Text className="text-white mb-2 font-medium">Email</Text>
            <TextInput
              className="bg-gray-800 text-white px-4 py-3 rounded-lg"
              placeholder="tu@email.com"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View>
            <Text className="text-white mb-2 font-medium">Contraseña</Text>
            <TextInput
              className="bg-gray-800 text-white px-4 py-3 rounded-lg"
              placeholder="••••••••"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Botón Login */}
          <TouchableOpacity
            className={`bg-blue-600 py-4 rounded-lg mt-6 ${
              loading ? 'opacity-50' : ''
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Iniciar Sesión
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Credenciales de prueba */}
        <View className="mt-8 p-4 bg-gray-800 rounded-lg">
          <Text className="text-gray-400 text-xs mb-2">
            Credenciales de prueba:
          </Text>
          <Text className="text-gray-300 text-xs">
            🏢 Gym: gym@test.com / password123
          </Text>
          <Text className="text-gray-300 text-xs">
            👤 Cliente: cliente@test.com / password123
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
