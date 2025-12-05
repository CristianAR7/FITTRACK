import { Tabs } from "expo-router";
import { Home, Dumbbell, Apple, TrendingUp, User, Users } from "lucide-react-native";
import React from "react";
import { useAuth } from "@/hooks/auth-context";

export default function TabLayout() {
  const { authState } = useAuth();
  const isGym = authState.role === 'gym';
  const isMaster = authState.role === 'master';
  const isClient = authState.role === 'client';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
        },
        headerStyle: {
          backgroundColor: '#1F2937',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: "Rutinas",
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
          href: isMaster ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Dieta",
          tabBarIcon: ({ color }) => <Apple size={24} color={color} />,
          href: isMaster ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progreso",
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
          href: (isGym || isMaster) ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: isMaster ? "Gimnasios" : "Clientes",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          href: isClient ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}