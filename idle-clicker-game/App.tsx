import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  const [points, setPoints] = useState(0);
  const [autoPoints, setAutoPoints] = useState(0);
  const [scale] = useState(new Animated.Value(1));

  useEffect(() => {
    const loadProgress = async () => {
      const savedPoints = await AsyncStorage.getItem('points');
      const savedAutoPoints = await AsyncStorage.getItem('autoPoints');
      if (savedPoints !== null) setPoints(parseInt(savedPoints));
      if (savedAutoPoints !== null) setAutoPoints(parseInt(savedAutoPoints));
    };
    loadProgress();
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      await AsyncStorage.setItem('points', points.toString());
      await AsyncStorage.setItem('autoPoints', autoPoints.toString());
    };
    saveProgress();
  }, [points, autoPoints]);

  // Incrementa pontos automaticamente a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prevPoints) => prevPoints + autoPoints);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoPoints]);

  const handleClick = () => {
    setPoints(points + 1);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const buyAutoClicker = () => {
    if (points >= 10) {
      setPoints(points - 10);
      setAutoPoints(autoPoints + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.points}>Pontos: {points}</Text>
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity style={styles.clickButton} onPress={handleClick}>
            <Text style={styles.clickButtonText}>Clique!</Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.autoClickerButton} onPress={buyAutoClicker}>
          <Text style={styles.autoClickerButtonText}>Comprar Auto Clicker (10 pontos)</Text>
        </TouchableOpacity>
        <Text style={styles.autoPoints}>Auto Clickers: {autoPoints}</Text>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#61dafb',
    marginBottom: 20,
  },
  points: {
    fontSize: 24,
    color: '#ffffff',
    marginVertical: 10,
  },
  autoPoints: {
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
  clickButton: {
    backgroundColor: '#61dafb',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  clickButtonText: {
    fontSize: 20,
    color: '#282c34',
  },
  autoClickerButton: {
    backgroundColor: '#21a1f1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  autoClickerButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
});
