import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Users,
  User,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useGymData } from '@/hooks/gym-data-context';
import { useAuth } from '@/hooks/auth-context';
import { DietPlan, Meal, Ingredient } from '@/types/gym';

export default function CreateDietScreen() {
  const { addDietPlan, clients } = useGymData();
  const { authState } = useAuth();
  const [planName, setPlanName] = useState<string>('');
  const [planDescription, setPlanDescription] = useState<string>('');
  const [planType, setPlanType] = useState<'generic' | 'specific'>('generic');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [dailyCalories, setDailyCalories] = useState<string>('2000');
  const [macros, setMacros] = useState({
    protein: 30,
    carbs: 45,
    fats: 25,
  });
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showClientSelector, setShowClientSelector] = useState<boolean>(false);

  const isGym = authState.role === 'gym';
  const availableClients = clients.filter(client => client.gymId === authState.gymId);

  const mealTypes = [
    { key: 'breakfast', label: 'Desayuno', icon: '🌅' },
    { key: 'lunch', label: 'Almuerzo', icon: '☀️' },
    { key: 'dinner', label: 'Cena', icon: '🌙' },
    { key: 'snack', label: 'Snack', icon: '🍎' },
  ];

  const addMeal = (type: string) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: '',
      type: type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      ingredients: [{
        name: '',
        amount: 0,
        unit: 'g',
        category: 'other' as const
      }]
    };
    setMeals([...meals, newMeal]);
  };

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter(m => m.id !== mealId));
  };

  const updateMeal = (mealId: string, field: keyof Meal, value: any) => {
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { ...meal, [field]: value }
        : meal
    ));
  };

  const addIngredient = (mealId: string) => {
    const newIngredient: Ingredient = {
      name: '',
      amount: 0,
      unit: 'g',
      category: 'other' as const
    };
    
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { ...meal, ingredients: [...meal.ingredients, newIngredient] }
        : meal
    ));
  };

  const removeIngredient = (mealId: string, ingredientIndex: number) => {
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { ...meal, ingredients: meal.ingredients.filter((_, index) => index !== ingredientIndex) }
        : meal
    ));
  };

  const updateIngredient = (mealId: string, ingredientIndex: number, field: keyof Ingredient, value: any) => {
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? {
            ...meal, 
            ingredients: meal.ingredients.map((ingredient, index) => 
              index === ingredientIndex 
                ? { ...ingredient, [field]: value }
                : ingredient
            )
          }
        : meal
    ));
  };

  const saveDietPlan = () => {
    if (!planName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el plan de dieta');
      return;
    }

    if (meals.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos una comida');
      return;
    }

    if (meals.some(m => !m.name.trim() || m.ingredients.some(i => !i.name.trim()))) {
      Alert.alert('Error', 'Completa todos los nombres de comidas e ingredientes');
      return;
    }

    if (planType === 'specific' && !selectedClientId) {
      Alert.alert('Error', 'Selecciona un cliente para el plan personalizado');
      return;
    }

    const newDietPlan: DietPlan = {
      id: Date.now().toString(),
      gymId: 'gym1',
      name: planName,
      description: planDescription,
      type: planType,
      goal: 'maintenance',
      dailyCalories: parseInt(dailyCalories),
      macros,
      meals,
      userId: planType === 'specific' ? selectedClientId : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDietPlan(newDietPlan);
    Alert.alert('Éxito', 'Plan de dieta creado correctamente', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const getMealsByType = (type: string) => {
    return meals.filter(meal => meal.type === type);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Plan de Dieta</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveDietPlan}
        >
          <Save size={24} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del plan</Text>
            <TextInput
              style={styles.input}
              value={planName}
              onChangeText={setPlanName}
              placeholder="Ej: Plan de Definición"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={planDescription}
              onChangeText={setPlanDescription}
              placeholder="Describe los objetivos de este plan..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={3}
            />
          </View>

          {isGym && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de plan</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[styles.typeButton, planType === 'generic' && styles.typeButtonActive]}
                  onPress={() => {
                    setPlanType('generic');
                    setSelectedClientId('');
                  }}
                >
                  <Users size={20} color={planType === 'generic' ? '#fff' : '#9CA3AF'} />
                  <Text style={[styles.typeButtonText, planType === 'generic' && styles.typeButtonTextActive]}>
                    Genérico
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, planType === 'specific' && styles.typeButtonActive]}
                  onPress={() => {
                    setPlanType('specific');
                    setShowClientSelector(true);
                  }}
                >
                  <User size={20} color={planType === 'specific' ? '#fff' : '#9CA3AF'} />
                  <Text style={[styles.typeButtonText, planType === 'specific' && styles.typeButtonTextActive]}>
                    Personalizado
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {planType === 'specific' && isGym && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cliente asignado</Text>
              <TouchableOpacity 
                style={styles.clientSelector}
                onPress={() => setShowClientSelector(true)}
              >
                <Text style={styles.clientSelectorText}>
                  {selectedClientId 
                    ? availableClients.find(c => c.id === selectedClientId)?.name || 'Seleccionar cliente'
                    : 'Seleccionar cliente'
                  }
                </Text>
                <User size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calorías diarias objetivo</Text>
            <TextInput
              style={styles.input}
              value={dailyCalories}
              onChangeText={setDailyCalories}
              placeholder="2000"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Distribución de Macronutrientes (%)</Text>
            <View style={styles.macroInputs}>
              <View style={styles.macroInput}>
                <Text style={styles.macroLabel}>Proteínas</Text>
                <TextInput
                  style={styles.macroValue}
                  value={macros.protein.toString()}
                  onChangeText={(value) => setMacros({...macros, protein: parseInt(value) || 0})}
                  keyboardType="numeric"
                />
                <Text style={styles.macroPercent}>%</Text>
              </View>
              <View style={styles.macroInput}>
                <Text style={styles.macroLabel}>Carbohidratos</Text>
                <TextInput
                  style={styles.macroValue}
                  value={macros.carbs.toString()}
                  onChangeText={(value) => setMacros({...macros, carbs: parseInt(value) || 0})}
                  keyboardType="numeric"
                />
                <Text style={styles.macroPercent}>%</Text>
              </View>
              <View style={styles.macroInput}>
                <Text style={styles.macroLabel}>Grasas</Text>
                <TextInput
                  style={styles.macroValue}
                  value={macros.fats.toString()}
                  onChangeText={(value) => setMacros({...macros, fats: parseInt(value) || 0})}
                  keyboardType="numeric"
                />
                <Text style={styles.macroPercent}>%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comidas</Text>
          
          {mealTypes.map((mealType) => {
            const mealsByType = getMealsByType(mealType.key);
            
            return (
              <View key={mealType.key} style={styles.mealTypeSection}>
                <View style={styles.mealTypeHeader}>
                  <View style={styles.mealTypeInfo}>
                    <Text style={styles.mealTypeIcon}>{mealType.icon}</Text>
                    <Text style={styles.mealTypeLabel}>{mealType.label}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.addMealButton}
                    onPress={() => addMeal(mealType.key)}
                  >
                    <Plus size={16} color="#10B981" />
                    <Text style={styles.addMealText}>Agregar</Text>
                  </TouchableOpacity>
                </View>

                {mealsByType.map((meal) => (
                  <View key={meal.id} style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                      <TextInput
                        style={styles.mealNameInput}
                        value={meal.name}
                        onChangeText={(value) => updateMeal(meal.id, 'name', value)}
                        placeholder="Nombre de la comida"
                        placeholderTextColor="#6B7280"
                      />
                      <TouchableOpacity onPress={() => removeMeal(meal.id)}>
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.mealMacros}>
                      <View style={styles.mealMacroInput}>
                        <Text style={styles.mealMacroLabel}>Calorías</Text>
                        <TextInput
                          style={styles.mealMacroValue}
                          value={meal.calories.toString()}
                          onChangeText={(value) => updateMeal(meal.id, 'calories', parseInt(value) || 0)}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.mealMacroInput}>
                        <Text style={styles.mealMacroLabel}>Proteína (g)</Text>
                        <TextInput
                          style={styles.mealMacroValue}
                          value={meal.protein.toString()}
                          onChangeText={(value) => updateMeal(meal.id, 'protein', parseInt(value) || 0)}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.mealMacroInput}>
                        <Text style={styles.mealMacroLabel}>Carbos (g)</Text>
                        <TextInput
                          style={styles.mealMacroValue}
                          value={meal.carbs.toString()}
                          onChangeText={(value) => updateMeal(meal.id, 'carbs', parseInt(value) || 0)}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.mealMacroInput}>
                        <Text style={styles.mealMacroLabel}>Grasas (g)</Text>
                        <TextInput
                          style={styles.mealMacroValue}
                          value={meal.fats.toString()}
                          onChangeText={(value) => updateMeal(meal.id, 'fats', parseInt(value) || 0)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View style={styles.ingredientsSection}>
                      <Text style={styles.ingredientsTitle}>Ingredientes</Text>
                      {meal.ingredients.map((ingredient, ingredientIndex) => (
                        <View key={ingredientIndex} style={styles.ingredientRow}>
                          <TextInput
                            style={styles.ingredientName}
                            value={ingredient.name}
                            onChangeText={(value) => updateIngredient(meal.id, ingredientIndex, 'name', value)}
                            placeholder="Ingrediente"
                            placeholderTextColor="#6B7280"
                          />
                          <TextInput
                            style={styles.ingredientAmount}
                            value={ingredient.amount.toString()}
                            onChangeText={(value) => updateIngredient(meal.id, ingredientIndex, 'amount', parseFloat(value) || 0)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#6B7280"
                          />
                          <TextInput
                            style={styles.ingredientUnit}
                            value={ingredient.unit}
                            onChangeText={(value) => updateIngredient(meal.id, ingredientIndex, 'unit', value)}
                            placeholder="g"
                            placeholderTextColor="#6B7280"
                          />
                          {meal.ingredients.length > 1 && (
                            <TouchableOpacity onPress={() => removeIngredient(meal.id, ingredientIndex)}>
                              <Trash2 size={14} color="#EF4444" />
                            </TouchableOpacity>
                          )}
                        </View>
                      ))}
                      <TouchableOpacity 
                        style={styles.addIngredientButton}
                        onPress={() => addIngredient(meal.id)}
                      >
                        <Plus size={14} color="#10B981" />
                        <Text style={styles.addIngredientText}>Agregar ingrediente</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {showClientSelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.clientModal}>
            <Text style={styles.modalTitle}>Seleccionar Cliente</Text>
            <ScrollView style={styles.clientList}>
              {availableClients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={[
                    styles.clientItem,
                    selectedClientId === client.id && styles.clientItemSelected
                  ]}
                  onPress={() => {
                    setSelectedClientId(client.id);
                    setShowClientSelector(false);
                  }}
                >
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientInitial}>
                      {client.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                  </View>
                  {selectedClientId === client.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowClientSelector(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#1F2937',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#10B981',
  },
  typeButtonText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  macroInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  macroInput: {
    flex: 1,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  macroValue: {
    backgroundColor: '#1F2937',
    borderRadius: 6,
    padding: 8,
    color: '#fff',
    textAlign: 'center',
    minWidth: 50,
  },
  macroPercent: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  mealTypeSection: {
    marginBottom: 20,
  },
  mealTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealTypeIcon: {
    fontSize: 20,
  },
  mealTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addMealText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealNameInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  mealMacroInput: {
    flex: 1,
  },
  mealMacroLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  mealMacroValue: {
    backgroundColor: '#374151',
    borderRadius: 4,
    padding: 6,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  ingredientsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.2)',
    paddingTop: 12,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ingredientName: {
    flex: 2,
    backgroundColor: '#374151',
    borderRadius: 4,
    padding: 6,
    color: '#fff',
    fontSize: 12,
  },
  ingredientAmount: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 4,
    padding: 6,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  ingredientUnit: {
    width: 40,
    backgroundColor: '#374151',
    borderRadius: 4,
    padding: 6,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  addIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 4,
    gap: 4,
    marginTop: 4,
  },
  addIngredientText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
  },
  clientSelector: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientSelectorText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientModal: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  clientList: {
    maxHeight: 300,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#374151',
  },
  clientItemSelected: {
    backgroundColor: '#10B981',
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clientEmail: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  modalCloseButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});