import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import ShopScreen from './screens/ShopScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  const [points, setPoints] = useState(0);
  const [autoPoints, setAutoPoints] = useState(0);
  const [scale] = useState(new Animated.Value(1));
  const [currentTab, setCurrentTab] = useState('game');

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

  const buyDoublePoints = () => {
    if (points >= 50) {
      setPoints(points - 50);
      setAutoPoints(autoPoints * 2);
    }
  };

  const buyTriplePoints = () => {
    if (points >= 100) {
      setPoints(points - 100);
      setAutoPoints(autoPoints * 3);
    }
  };

  const formatNumber = (num: number) => {
    return num.toExponential(2);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'game':
        return (
          <>
            <Text style={styles.points}>Pontos: {formatNumber(points)}</Text>
            <Animated.View style={{ transform: [{ scale }] }}>
              <TouchableOpacity style={styles.clickButton} onPress={handleClick}>
                <Text style={styles.clickButtonText}>Clique!</Text>
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity style={styles.autoClickerButton} onPress={buyAutoClicker}>
              <Text style={styles.autoClickerButtonText}>Comprar Auto Clicker (10 pontos)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doublePointsButton} onPress={buyDoublePoints}>
              <Text style={styles.doublePointsButtonText}>Dobrar Pontos (50 pontos)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.triplePointsButton} onPress={buyTriplePoints}>
              <Text style={styles.triplePointsButtonText}>Triplicar Pontos (100 pontos)</Text>
            </TouchableOpacity>
            <Text style={styles.autoPoints}>Auto Clickers: {formatNumber(autoPoints)}</Text>
          </>
        );
      case 'shop':
        return <ShopScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {renderContent()}
      </View>
      <NavigationBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
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
    paddingBottom: 50, // Adicionar espaço para a barra de navegação
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
  doublePointsButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  doublePointsButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  triplePointsButton: {
    backgroundColor: '#ffa500',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  triplePointsButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  shop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopText: {
    fontSize: 24,
    color: '#ffffff',
  },
  settings: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 24,
    color: '#ffffff',
  },
});
