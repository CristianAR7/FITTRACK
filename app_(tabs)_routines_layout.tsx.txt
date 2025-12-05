import { Stack } from 'expo-router';

export default function RoutinesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1F2937',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Rutinas',
        }} 
      />
      <Stack.Screen 
        name="[routineId]" 
        options={{ 
          title: 'Detalle de Rutina',
        }} 
      />
    </Stack>
  );
}