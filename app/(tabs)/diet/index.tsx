import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Apple, 
  Flame,
  Beef,
  Wheat,
  Droplet,
  ShoppingCart,
  Plus,
  ChevronRight,
  Users,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-context';
import { useGymData } from '@/hooks/gym-data-context';
import { router } from 'expo-router';
import { Meal } from '@/types/gym';

export default function DietScreen() {
  const { authState } = useAuth();
  const { dietPlans } = useGymData();
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const isGym = authState.role === 'gym';
  
  if (isGym) {
    // Gym view: Show created diet plans for management
    const gymDietPlans = dietPlans.filter(plan => 
      plan.type === 'generic' || (plan.type === 'specific' && plan.gymId === authState.gymId)
    );

    const renderDietPlanCard = (plan: any) => {
      const totalCalories = plan.meals.reduce((acc: number, meal: any) => acc + meal.calories, 0);
      const assignedCount = plan.type === 'specific' ? 1 : 0; // Mock assigned count
      
      return (
        <TouchableOpacity 
          key={plan.id}
          style={styles.dietPlanCard}
          onPress={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
        >
          <LinearGradient
            colors={['#1F2937', '#111827']}
            style={styles.dietPlanGradient}
          >
            <View style={styles.dietPlanHeader}>
              <View style={styles.dietPlanInfo}>
                <Text style={styles.dietPlanName}>{plan.name}</Text>
                <Text style={styles.dietPlanDescription}>{plan.description}</Text>
                <View style={styles.dietPlanStats}>
                  <Text style={styles.dietPlanStat}>{totalCalories} kcal/día</Text>
                  <Text style={styles.dietPlanStat}>•</Text>
                  <Text style={styles.dietPlanStat}>{plan.meals.length} comidas</Text>
                  <Text style={styles.dietPlanStat}>•</Text>
                  <Text style={styles.dietPlanStat}>
                    {plan.type === 'generic' ? 'Plan genérico' : 'Plan específico'}
                  </Text>
                </View>
              </View>
              <ChevronRight 
                size={20} 
                color="#9CA3AF" 
                style={{ transform: [{ rotate: selectedPlan === plan.id ? '90deg' : '0deg' }] }}
              />
            </View>
            
            {selectedPlan === plan.id && (
              <View style={styles.dietPlanDetails}>
                <View style={styles.macrosSummary}>
                  <Text style={styles.macrosSummaryTitle}>Resumen Nutricional</Text>
                  <View style={styles.macrosRow}>
                    <Text style={styles.macroItem}>P: {plan.macros.protein}%</Text>
                    <Text style={styles.macroItem}>C: {plan.macros.carbs}%</Text>
                    <Text style={styles.macroItem}>G: {plan.macros.fats}%</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.assignButton}
                  onPress={() => router.push('/diet/assign')}
                >
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={styles.assignButtonGradient}
                  >
                    <Users size={16} color="#fff" />
                    <Text style={styles.assignButtonText}>Asignar a Cliente</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      );
    };

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Gestión de Dietas</Text>
          <Text style={styles.headerSubtitle}>
            Administra los planes de dieta de tu gimnasio
          </Text>
        </LinearGradient>

        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Planes de Dieta Creados ({gymDietPlans.length})</Text>
          
          {gymDietPlans.length === 0 ? (
            <View style={styles.emptyState}>
              <Apple size={48} color="#6B7280" />
              <Text style={styles.emptyStateTitle}>No hay planes de dieta</Text>
              <Text style={styles.emptyStateText}>
                Crea tu primer plan de dieta para empezar a asignar a tus clientes
              </Text>
            </View>
          ) : (
            gymDietPlans.map(renderDietPlanCard)
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/diet/create')}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.addButtonGradient}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Crear Plan de Dieta</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  
  // Client view: Show user's active diet plan
  const activeDietPlan = dietPlans.find(plan => 
    plan.type === 'specific' && plan.userId === authState.userId
  ) || dietPlans.find(plan => plan.type === 'generic');

  const totalCalories = activeDietPlan?.meals.reduce((acc, meal) => acc + meal.calories, 0) || 0;
  const totalProtein = activeDietPlan?.meals.reduce((acc, meal) => acc + meal.protein, 0) || 0;
  const totalCarbs = activeDietPlan?.meals.reduce((acc, meal) => acc + meal.carbs, 0) || 0;
  const totalFats = activeDietPlan?.meals.reduce((acc, meal) => acc + meal.fats, 0) || 0;

  const macroStats = [
    {
      name: 'Calorías',
      value: totalCalories,
      target: activeDietPlan?.dailyCalories || 2000,
      unit: 'kcal',
      icon: Flame,
      color: '#EF4444',
    },
    {
      name: 'Proteínas',
      value: totalProtein,
      target: Math.round((activeDietPlan?.dailyCalories || 2000) * (activeDietPlan?.macros.protein || 30) / 100 / 4),
      unit: 'g',
      icon: Beef,
      color: '#10B981',
    },
    {
      name: 'Carbohidratos',
      value: totalCarbs,
      target: Math.round((activeDietPlan?.dailyCalories || 2000) * (activeDietPlan?.macros.carbs || 45) / 100 / 4),
      unit: 'g',
      icon: Wheat,
      color: '#F59E0B',
    },
    {
      name: 'Grasas',
      value: totalFats,
      target: Math.round((activeDietPlan?.dailyCalories || 2000) * (activeDietPlan?.macros.fats || 25) / 100 / 9),
      unit: 'g',
      icon: Droplet,
      color: '#3B82F6',
    },
  ];

  const mealTypes = [
    { key: 'breakfast', label: 'Desayuno', icon: '🌅' },
    { key: 'lunch', label: 'Almuerzo', icon: '☀️' },
    { key: 'dinner', label: 'Cena', icon: '🌙' },
    { key: 'snack', label: 'Snack', icon: '🍎' },
  ];

  const getMealsByType = (type: string) => {
    return activeDietPlan?.meals.filter(meal => meal.type === type) || [];
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.header}
      >
        {activeDietPlan ? (
          <>
            <Text style={styles.planName}>{activeDietPlan.name}</Text>
            <Text style={styles.planDescription}>{activeDietPlan.description}</Text>
          </>
        ) : (
          <Text style={styles.noPlanText}>No tienes un plan de dieta activo</Text>
        )}

        <TouchableOpacity 
          style={styles.shoppingButton}
          onPress={() => router.push('/diet/shopping-list')}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.shoppingButtonGradient}
          >
            <ShoppingCart size={20} color="#fff" />
            <Text style={styles.shoppingButtonText}>Lista de Compra</Text>
            <ChevronRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {activeDietPlan && (
        <>
          <View style={styles.macrosContainer}>
            <Text style={styles.sectionTitle}>Resumen Nutricional</Text>
            <View style={styles.macrosGrid}>
              {macroStats.map((macro, index) => (
                <View key={index} style={styles.macroCard}>
                  <View style={[styles.macroIcon, { backgroundColor: `${macro.color}20` }]}>
                    <macro.icon size={20} color={macro.color} />
                  </View>
                  <Text style={styles.macroName}>{macro.name}</Text>
                  <Text style={styles.macroValue}>
                    {macro.value}
                    <Text style={styles.macroUnit}> {macro.unit}</Text>
                  </Text>
                  <View style={styles.macroProgress}>
                    <View style={styles.macroProgressBar}>
                      <View 
                        style={[
                          styles.macroProgressFill, 
                          { 
                            width: `${Math.min((macro.value / macro.target) * 100, 100)}%`,
                            backgroundColor: macro.color,
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.macroTarget}>
                      de {macro.target} {macro.unit}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.mealsContainer}>
            <Text style={styles.sectionTitle}>Comidas del Día</Text>
            
            {mealTypes.map((mealType) => {
              const meals = getMealsByType(mealType.key);
              const isExpanded = selectedMealType === mealType.key;
              
              return (
                <TouchableOpacity
                  key={mealType.key}
                  style={styles.mealTypeCard}
                  onPress={() => setSelectedMealType(isExpanded ? null : mealType.key as any)}
                >
                  <View style={styles.mealTypeHeader}>
                    <View style={styles.mealTypeInfo}>
                      <Text style={styles.mealTypeIcon}>{mealType.icon}</Text>
                      <View>
                        <Text style={styles.mealTypeLabel}>{mealType.label}</Text>
                        <Text style={styles.mealTypeCount}>{meals.length} opciones</Text>
                      </View>
                    </View>
                    <ChevronRight 
                      size={20} 
                      color="#9CA3AF" 
                      style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                    />
                  </View>

                  {isExpanded && meals.map((meal, index) => (
                    <View key={index} style={styles.mealCard}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <View style={styles.mealMacros}>
                        <Text style={styles.mealMacro}>{meal.calories} kcal</Text>
                        <Text style={styles.mealMacro}>P: {meal.protein}g</Text>
                        <Text style={styles.mealMacro}>C: {meal.carbs}g</Text>
                        <Text style={styles.mealMacro}>G: {meal.fats}g</Text>
                      </View>
                      
                      <View style={styles.ingredientsList}>
                        {meal.ingredients.map((ingredient, idx) => (
                          <Text key={idx} style={styles.ingredient}>
                            • {ingredient.amount} {ingredient.unit} de {ingredient.name}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ))}
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    paddingBottom: 24,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  noPlanText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 20,
  },
  shoppingButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  shoppingButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  shoppingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  macrosContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  macroCard: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  macroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroName: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  macroUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  macroProgress: {
    width: '100%',
  },
  macroProgressBar: {
    height: 4,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 2,
    marginBottom: 4,
  },
  macroProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  macroTarget: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  mealsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  mealTypeCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  mealTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  mealTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealTypeIcon: {
    fontSize: 24,
  },
  mealTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  mealTypeCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  mealCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    margin: 12,
    marginTop: 0,
    padding: 12,
    borderRadius: 8,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  mealMacro: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  ingredientsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.2)',
    paddingTop: 8,
  },
  ingredient: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  actionButtons: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  plansContainer: {
    padding: 20,
  },
  dietPlanCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dietPlanGradient: {
    padding: 16,
  },
  dietPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dietPlanInfo: {
    flex: 1,
    marginRight: 12,
  },
  dietPlanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  dietPlanDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  dietPlanStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dietPlanStat: {
    fontSize: 12,
    color: '#6B7280',
  },
  dietPlanDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.2)',
  },
  macrosSummary: {
    marginBottom: 16,
  },
  macrosSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 16,
  },
  macroItem: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  assignButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  assignButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 6,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});