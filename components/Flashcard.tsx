import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface Props {
  title: string;
  answer: string;
  image?: string;
  onDelete: () => void;
  category?: string;
}

const Flashcard: React.FC<Props> = ({ title, answer, image, onDelete }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const renderRightActions = () => (
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: showAnswer ? '#FFDDDD' : '#f0f044' }, // 🔄 Color changes here
        ]}
        onPress={() => setShowAnswer(!showAnswer)}
        activeOpacity={0.9}
      >
        {!showAnswer && image && (
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        )}
        <Text style={styles.text}>{showAnswer ? answer : title}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginVertical: 16,
    marginRight: 10,
    borderRadius: 12,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Flashcard;
