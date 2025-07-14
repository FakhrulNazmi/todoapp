import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ✅ Required wrapper

import HomeScreen from './screens/HomeScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import AddCardScreen from './screens/AddCardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Flashcard" component={FlashcardScreen} />
          <Stack.Screen name="AddCard" component={AddCardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
