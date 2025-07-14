import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Flashcard from '../components/Flashcard'; // adjust path if needed
import { FlashcardType } from '../types';

const FlashcardScreen: React.FC = () => {
  const [cards, setCards] = useState<FlashcardType[]>([]);

  useEffect(() => {
    const loadCards = async () => {
      const json = await AsyncStorage.getItem('flashcards');
      const savedCards: FlashcardType[] = json ? JSON.parse(json) : [];
      setCards(savedCards);
    };

    const unsubscribe = loadCards();
    return () => {
      // optional cleanup
    };
  }, []);

  const handleDelete = async (cardToDelete: FlashcardType) => {
    const updatedCards = cards.filter(
      (card) =>
        !(
          card.title === cardToDelete.title &&
          card.answer === cardToDelete.answer
        )
    );
    setCards(updatedCards);
    await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cards.length === 0 ? (
        <Text style={styles.emptyText}>No flashcards yet</Text>
      ) : (
        cards.map((card, index) => (
          <Flashcard
            key={`${card.title}-${index}`} // ✅ unique key using title + index
            title={card.title}
            answer={card.answer}
            image={card.image}
            answerImage={card.answerImage}
            onDelete={() => handleDelete(card)}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default FlashcardScreen;
