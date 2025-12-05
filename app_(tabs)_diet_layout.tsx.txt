import { Stack } from 'expo-router';

export default function DietLayout() {
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
          title: 'Dieta y Nutrición',
        }} 
      />
      <Stack.Screen 
        name="shopping-list" 
        options={{ 
          title: 'Lista de Compra',
        }} 
      />
    </Stack>
  );
}