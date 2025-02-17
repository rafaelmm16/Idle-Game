import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ShopScreenProps {
  points: number;
  setPoints: (points: number) => void;
  autoPoints: number;
  setAutoPoints: (autoPoints: number) => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ points, setPoints, autoPoints, setAutoPoints }) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Loja!</Text>
      <TouchableOpacity style={styles.shopButton} onPress={buyAutoClicker}>
        <Text style={styles.shopButtonText}>Comprar Auto Clicker (10 pontos)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shopButton} onPress={buyDoublePoints}>
        <Text style={styles.shopButtonText}>Dobrar Pontos (50 pontos)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shopButton} onPress={buyTriplePoints}>
        <Text style={styles.shopButtonText}>Triplicar Pontos (100 pontos)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#61dafb',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  shopButtonText: {
    fontSize: 16,
    color: '#282c34',
  },
});

export default ShopScreen;
