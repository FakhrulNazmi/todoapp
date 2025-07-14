import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashcardType } from '../types';
import Flashcard from '../components/Flashcard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the same stack inline here again
type RootStackParamList = {
  Home: undefined;
  Flashcard: undefined;
  AddCard: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.plusButton} onPress={() => navigation.navigate('AddCard')}>
          ＋
        </Text>
      ),
      title: 'Categories',
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

  // Group by category
  const grouped = flashcards.reduce<Record<string, FlashcardType[]>>((acc, card) => {
    const key = card.category?.trim() || 'Others';
    if (!acc[key]) acc[key] = [];
    acc[key].push(card);
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(grouped).map(([category, cards]) => (
        <View key={category} style={styles.categoryGroup}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {cards.map((card, index) => (
            <Flashcard
              key={`${category}-${index}`}
              title={card.title}
              answer={card.answer}
              image={card.image}
              onDelete={async () => {
                const updated = flashcards.filter(
                  (c) => !(c.title === card.title && c.answer === card.answer)
                );
                await AsyncStorage.setItem('flashcards', JSON.stringify(updated));
                setFlashcards(updated);
              }}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  categoryGroup: { paddingHorizontal: 16, paddingTop: 20 },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  plusButton: {
    fontSize: 26,
    marginRight: 16,
    color: '#007AFF',
  },
});

export default HomeScreen;
