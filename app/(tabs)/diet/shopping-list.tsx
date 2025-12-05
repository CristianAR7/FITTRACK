import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Check,
  ShoppingCart,
  Package,
} from 'lucide-react-native';
import { useGymData } from '@/hooks/gym-data-context';
import { useAuth } from '@/hooks/auth-context';
import { Ingredient } from '@/types/gym';

interface GroupedIngredient extends Ingredient {
  id: string;
  checked: boolean;
}

export default function ShoppingListScreen() {
  const { authState } = useAuth();
  const { dietPlans } = useGymData();
  
  // Get user's active diet plan
  const activeDietPlan = dietPlans.find(plan => 
    plan.type === 'specific' && plan.userId === authState.userId
  ) || dietPlans.find(plan => plan.type === 'generic');

  // Group and combine ingredients
  const groupedIngredients = useMemo(() => {
    if (!activeDietPlan) return {};
    
    const groups: Record<string, GroupedIngredient[]> = {};
    
    activeDietPlan.meals.forEach(meal => {
      meal.ingredients.forEach(ingredient => {
        if (!groups[ingredient.category]) {
          groups[ingredient.category] = [];
        }
        
        const existing = groups[ingredient.category].find(
          i => i.name === ingredient.name && i.unit === ingredient.unit
        );
        
        if (existing) {
          existing.amount += ingredient.amount;
        } else {
          groups[ingredient.category].push({
            ...ingredient,
            id: `${ingredient.name}_${ingredient.unit}_${Date.now()}`,
            checked: false,
          });
        }
      });
    });
    
    return groups;
  }, [activeDietPlan]);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'protein': return '🥩';
      case 'carbs': return '🌾';
      case 'vegetables': return '🥬';
      case 'fruits': return '🍎';
      case 'dairy': return '🥛';
      case 'fats': return '🥑';
      default: return '🛒';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'protein': return 'Proteínas';
      case 'carbs': return 'Carbohidratos';
      case 'vegetables': return 'Verduras';
      case 'fruits': return 'Frutas';
      case 'dairy': return 'Lácteos';
      case 'fats': return 'Grasas';
      default: return 'Otros';
    }
  };

  const totalItems = Object.values(groupedIngredients).flat().length;
  const checkedCount = checkedItems.size;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <ShoppingCart size={32} color="#10B981" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Lista de Compra</Text>
            <Text style={styles.headerSubtitle}>
              {checkedCount} de {totalItems} items completados
            </Text>
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedIngredients).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
              <Text style={styles.categoryTitle}>{getCategoryName(category)}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryCount}>{items.length}</Text>
              </View>
            </View>

            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  checkedItems.has(item.id) && styles.itemCardChecked
                ]}
                onPress={() => toggleItem(item.id)}
              >
                <View style={[
                  styles.checkbox,
                  checkedItems.has(item.id) && styles.checkboxChecked
                ]}>
                  {checkedItems.has(item.id) && (
                    <Check size={16} color="#fff" />
                  )}
                </View>
                
                <View style={styles.itemInfo}>
                  <Text style={[
                    styles.itemName,
                    checkedItems.has(item.id) && styles.itemNameChecked
                  ]}>
                    {item.name}
                  </Text>
                  <Text style={[
                    styles.itemAmount,
                    checkedItems.has(item.id) && styles.itemAmountChecked
                  ]}>
                    {item.amount} {item.unit}
                  </Text>
                </View>

                <Package 
                  size={20} 
                  color={checkedItems.has(item.id) ? '#10B981' : '#6B7280'} 
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {totalItems === 0 && (
          <View style={styles.emptyState}>
            <ShoppingCart size={48} color="#6B7280" />
            <Text style={styles.emptyText}>
              No hay items en tu lista de compra
            </Text>
            <Text style={styles.emptySubtext}>
              Activa un plan de dieta para generar tu lista
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  itemCardChecked: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#374151',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  itemNameChecked: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  itemAmount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  itemAmountChecked: {
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});