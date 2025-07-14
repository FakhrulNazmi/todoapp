import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

interface Props {
  title: string;
  answer: string;
  image?: string;           // Optional image for title
  answerImage?: string;     // Optional image for answer
  category?: string;        // Optional category (not used here, but safe to include)
  onDelete?: () => void;    // Optional long-press delete
}

const Flashcard: React.FC<Props> = ({
  title,
  answer,
  image,
  answerImage,
  category,
  onDelete,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleLongPress = () => {
    Alert.alert('Delete this card?', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete?.(),
      },
    ]);
  };

  return (
    <TouchableOpacity
        style={[
            styles.card,
            { backgroundColor: showAnswer ? '#d0f0ff' : '#fef28a' },
        ]}
        onPress={() => setShowAnswer(!showAnswer)}
        onLongPress={handleLongPress}
    >
      {showAnswer ? (
  <>
    {answerImage && (
      <Image source={{ uri: answerImage }} style={styles.image} />
    )}
    {answer ? (
      <Text style={styles.text}>{answer}</Text>
    ) : !answerImage ? (
      <Text style={[styles.text, { color: 'red' }]}>
        No answer provided
      </Text>
    ) : null}
  </>
) : (
  <>
    {image && <Image source={{ uri: image }} style={styles.image} />}
    <Text style={styles.text}>{title}</Text>
  </>
)}

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

export default Flashcard;
