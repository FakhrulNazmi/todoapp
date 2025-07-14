import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { FlashcardType } from '../types';


const AddCardScreen: React.FC = () => {
    const [title, setTitle] = useState('');
    const [answer, setAnswer] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [category, setCategory] = useState('');

    const [answerImage, setAnswerImage] = useState<string | null>(null);

    const pickAnswerImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets[0].uri) {
            setAnswerImage(result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please grant camera roll permissions.");
        return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
        base64: false,
        });

        if (!result.canceled && result.assets && result.assets[0].uri) {
        setImage(result.assets[0].uri);
        }
    };

  const saveCard = async () => {
    if (!title || !answer || !category) {
      Alert.alert('All fields are required');
      return;
    }

    if (title.trim().length < 5) {
      Alert.alert('Title must be at least 5 characters');
      return;
    }

    const newCard: FlashcardType = {
      title: title.trim(),
      answer: answer.trim(),
      answerImage: answerImage ?? undefined,
      image: image ?? undefined,
      category: category.trim(),
    };

    const json = await AsyncStorage.getItem('flashcards');
    const cards: FlashcardType[] = json ? JSON.parse(json) : [];
    cards.push(newCard);
    await AsyncStorage.setItem('flashcards', JSON.stringify(cards));
    

    setTitle('');
    setAnswer('');
    setImage(null);
    setCategory('');
    setAnswerImage(null);
    Alert.alert('Card saved!');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Enter answer"
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
      />

      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <Button title="Pick Image for Answer" onPress={pickAnswerImage} />
        {answerImage && <Image source={{ uri: answerImage }} style={styles.preview} />}


      <TextInput
        placeholder="Enter category (e.g. Animal, Flower)"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Button title="Save Flashcard" onPress={saveCard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, gap: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  preview: {
    width: 150,
    height: 150,
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default AddCardScreen;
