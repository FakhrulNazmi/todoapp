// screens/FlashcardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import Flashcard from '../components/Flashcard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashcardType } from '../types';

const FlashcardScreen: React.FC = () => {
  const [cards, setCards] = useState<FlashcardType[]>([]);

  const loadCards = async () => {
    const json = await AsyncStorage.getItem('flashcards');
    if (json) setCards(JSON.parse(json));
  };

  const deleteCard = async (index: number) => {
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));
    setCards(updatedCards);
    Alert.alert('Flashcard deleted');
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <View>
      <FlatList
        data={cards}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Flashcard
            category={item.category}
            title={item.title}
            answer={item.answer}
            image={item.image}
            onDelete={() => deleteCard(index)}
          />
        )}
      />
    </View>
  );
};

export default FlashcardScreen;
