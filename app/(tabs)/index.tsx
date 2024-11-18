import { Image, StyleSheet, Platform, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from 'react-native-paper';
import React, { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [clicks, setClicks] = useState(0);
  const [clicksPerSecond, setClicksPerSecond] = useState(0);
  const [autoClickers, setAutoClickers] = useState(0);
  const [autoClickerCost, setAutoClickerCost] = useState(10);
  const [upgrades, setUpgrades] = useState([
    { name: 'Enhanced Clicking', cost: 100, cpsBoost: 5 },
    { name: 'Super Clicks', cost: 500, cpsBoost: 20 },
    { name: 'Mega Clicks', cost: 2000, cpsBoost: 100 },
  ]);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (clicksPerSecond > 0) {
      interval = setInterval(() => {
        setClicks((prevClicks) => prevClicks + clicksPerSecond);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [clicksPerSecond]);

  const handleButtonClick = () => {
    setClicks((prevClicks) => prevClicks + 1);
  };

  const buyAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      setClicks((prevClicks) => prevClicks - autoClickerCost);
      setAutoClickers((prevAutoClickers) => prevAutoClickers + 1);
      setClicksPerSecond((prevCPS) => prevCPS + 1);
      setAutoClickerCost((prevCost) => Math.floor(prevCost * 1.15));
    }
  };

  const buyUpgrade = (index: number) => {
    const upgrade = upgrades[index];
    if (clicks >= upgrade.cost) {
      setClicks((prevClicks) => prevClicks - upgrade.cost);
      setClicksPerSecond((prevCPS) => prevCPS + upgrade.cpsBoost);

      // Update the upgrade cost and make a new upgrades array
      const newUpgrades = [...upgrades];
      newUpgrades[index] = { ...upgrade, cost: Math.floor(upgrade.cost * 1.5) }; // Increase cost by 50%
      setUpgrades(newUpgrades);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Idle Clicker!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.gameContainer}>
        <ThemedText type="title">Clicks: {clicks}</ThemedText>
        <Button mode="contained" onPress={handleButtonClick}>
          Click Me!
        </Button>
        <ThemedText>Clicks Per Second: {clicksPerSecond}</ThemedText>
        <ThemedText>Auto-Clickers: {autoClickers}</ThemedText>
        <Button
          mode="contained"
          onPress={buyAutoClicker}
          disabled={clicks < autoClickerCost}
          style={[styles.button, clicks < autoClickerCost && styles.disabledButton]} // Apply button styles
        >
          Buy Auto-Clicker ({autoClickerCost} clicks)
        </Button>

        {/* Upgrades Section */}
        <ThemedView style={styles.upgradesContainer}>
          {upgrades.map((upgrade, index) => (
            <View key={index} style={styles.upgradeItem}>
              <Button
                mode="contained"
                onPress={() => buyUpgrade(index)}
                disabled={clicks < upgrade.cost}
                style={[styles.button, clicks < upgrade.cost && styles.disabledButton]} // Apply button styles here too
              >
                {upgrade.name} ({upgrade.cost} clicks)
              </Button>
            </View>
          ))}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gameContainer: {
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: { // Style for ALL buttons
    marginTop: 10,
  },
  upgradesContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  upgradeItem: {
    width: '100%',
    marginBottom: 10,
  },
  upgradeButton: { // Default button style
    marginTop: 10,
  },
  disabledUpgradeButton: { // Style for disabled buttons
    backgroundColor: 'gray',
  },
  disabledButton: { // Style for disabled buttons
    backgroundColor: 'gray',
  },
});