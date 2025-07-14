import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FlashcardType } from '../types';
import Flashcard from '../components/Flashcard';

type RootStackParamList = {
  Home: undefined;
  AddCard: undefined;
  Category: { category: string; cards: FlashcardType[] };
};

type CategoryRouteProp = RouteProp<RootStackParamList, 'Category'>;

const CategoryScreen: React.FC = () => {
  const route = useRoute<CategoryRouteProp>();
  const navigation = useNavigation();
  const { category } = route.params;

  // local state to rerender after delete
  const [cards, setCards] = useState<FlashcardType[]>(route.params.cards);

  const handleDelete = async (deletedCard: FlashcardType) => {
    try {
      const json = await AsyncStorage.getItem('flashcards');
      const allCards: FlashcardType[] = json ? JSON.parse(json) : [];

      const updated = allCards.filter(
        (card) =>
          !(
            card.title === deletedCard.title &&
            card.answer === deletedCard.answer &&
            card.category === deletedCard.category
          )
      );

      await AsyncStorage.setItem('flashcards', JSON.stringify(updated));

      // Update local state to rerender
      const newCards = cards.filter(
        (card) =>
          !(
            card.title === deletedCard.title &&
            card.answer === deletedCard.answer &&
            card.category === deletedCard.category
          )
      );

      setCards(newCards);

      if (newCards.length === 0) {
        Alert.alert('All cards in this category deleted');
        navigation.goBack(); // go back if category is now empty
      }
    } catch (err) {
      console.error('Failed to delete card', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{category}</Text>
      {cards.map((card, index) => (
        <Flashcard
          title={card.title}
          answer={card.answer}
          image={card.image}
          answerImage={card.answerImage} // ✅ must be passed
          onDelete={() => handleDelete(card)}
        />


      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40, paddingHorizontal: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#222',
  },
});

export default CategoryScreen;
