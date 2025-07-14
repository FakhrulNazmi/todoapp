import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashcardType } from '../types';

type RootStackParamList = {
  Home: undefined;
  AddCard: undefined;
  Category: { category: string; cards: FlashcardType[] };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Categories',
      headerRight: () => (
        <Text style={styles.plusButton} onPress={() => navigation.navigate('AddCard')}>
          ＋
        </Text>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const json = await AsyncStorage.getItem('flashcards');
      const cards: FlashcardType[] = json ? JSON.parse(json) : [];
      setFlashcards(cards);
    };
    const unsubscribe = navigation.addListener('focus', fetchFlashcards);
    return unsubscribe;
  }, [navigation]);

  const grouped = flashcards.reduce<Record<string, FlashcardType[]>>((acc, card) => {
    const key = card.category?.trim() || 'Others';
    if (!acc[key]) acc[key] = [];
    acc[key].push(card);
    return acc;
  }, {});

  const categoryList = Object.entries(grouped);

  if (categoryList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No flashcards yet. Tap ＋ to add one!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {categoryList.map(([category, cards]) => (
        <TouchableOpacity
          key={category}
          style={styles.categoryButton}
          onPress={() => navigation.navigate('Category', { category, cards })}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  plusButton: {
    fontSize: 26,
    marginRight: 16,
    color: '#007AFF',
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});

export default HomeScreen;
