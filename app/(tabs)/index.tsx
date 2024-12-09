import { Image, StyleSheet, Platform, Text, View, Animated, AppState, AppStateStatus } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [clicks, setClicks] = useState(0);
  const [clicksPerSecond, setClicksPerSecond] = useState(0); // Not used directly for click accumulation anymore
  const [autoClickers, setAutoClickers] = useState(0);
  const [autoClickerCost, setAutoClickerCost] = useState(10);
  const [upgrades, setUpgrades] = useState([
    { name: 'Enhanced Clicking', cost: 100, cpsBoost: 5 },
    { name: 'Super Clicks', cost: 500, cpsBoost: 20 },
    { name: 'Mega Clicks', cost: 2000, cpsBoost: 100 },
  ]);
  const [multipliers, setMultipliers] = useState([
    { name: 'Click Multiplier', level: 0, cost: 100, multiplier: 2 },
    { name: 'Auto-Clicker Multiplier', level: 0, cost: 500, multiplier: 1.5 },
  ]);

  const clicksSharedValue = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(buttonScale.value, { duration: 100 }) }],
    };
  });

  // Calculate total click multiplier
  const clickMultiplier = multipliers.reduce((total, mult) => total * (mult.multiplier ** mult.level), 1);

    // Calculate total auto-clicker output
  const autoClickerOutput = autoClickers * multipliers.find(m => m.name === 'Auto-Clicker Multiplier')?.multiplier ** multipliers.find(m => m.name === 'Auto-Clicker Multiplier')?.level || 1;


  useEffect(() => {
    clicksSharedValue.value = clicks;
  }, [clicks]);


  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (autoClickerOutput > 0) {
      interval = setInterval(() => {
        setClicks(prevClicks => {
          const newClicks = prevClicks + autoClickerOutput; 
          clicksSharedValue.value = newClicks;
          return newClicks;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [autoClickerOutput]);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const savedClicks = await AsyncStorage.getItem('clicks');
        const savedAutoClickers = await AsyncStorage.getItem('autoClickers');
        const savedAutoClickerCost = await AsyncStorage.getItem('autoClickerCost');
        const savedUpgrades = await AsyncStorage.getItem('upgrades');
        const savedMultipliers = await AsyncStorage.getItem('multipliers');

        if (savedClicks !== null) {
          setClicks(parseInt(savedClicks, 10));
          clicksSharedValue.value = parseInt(savedClicks, 10);
        }

        if (savedAutoClickers !== null) {
          setAutoClickers(parseInt(savedAutoClickers, 10));
        }

        if (savedAutoClickerCost !== null) {
          setAutoClickerCost(parseInt(savedAutoClickerCost, 10));
        }

        if (savedUpgrades !== null) {
          setUpgrades(JSON.parse(savedUpgrades));
        }
        if (savedMultipliers !== null) {
          setMultipliers(JSON.parse(savedMultipliers));
        }

      } catch (error) {
        console.error('Error loading game data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, []);

  useEffect(() => {
    const saveGameData = async () => {
      try {
        await AsyncStorage.setItem('clicks', clicks.toString());
        await AsyncStorage.setItem('autoClickers', autoClickers.toString());
        await AsyncStorage.setItem('autoClickerCost', autoClickerCost.toString());
        await AsyncStorage.setItem('upgrades', JSON.stringify(upgrades));
        await AsyncStorage.setItem('multipliers', JSON.stringify(multipliers));


      } catch (error) {
        console.error('Error saving game data:', error);
      }
    };

    const saveInterval = setInterval(saveGameData, 5000);

    const appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'active') {
        saveGameData();
      }
    });

    return () => {
      clearInterval(saveInterval);
      appStateSubscription.remove();
    };
  }, [clicks, autoClickers, autoClickerCost, upgrades, multipliers]);

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  const handleButtonClick = () => {
    setClicks(prevClicks => prevClicks + Math.round(1 * clickMultiplier));
    buttonScale.value = 0.9;
    setTimeout(() => {
      buttonScale.value = 1;
    }, 100);
  };

  const buyAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      setClicks(prevClicks => prevClicks - autoClickerCost);
      setAutoClickers(prevAutoClickers => prevAutoClickers + 1);
      setAutoClickerCost(prevCost => Math.floor(prevCost * 1.15));
    }
  };


  const buyUpgrade = (index: number) => {
    const upgrade = upgrades[index];
    if (clicks >= upgrade.cost) {
      setClicks(prevClicks => prevClicks - upgrade.cost);
      const newUpgrades = [...upgrades];
      newUpgrades[index] = { ...upgrade, cost: Math.floor(upgrade.cost * 1.5) };
      setUpgrades(newUpgrades);
      // Here would apply the cpsBoost.  Since it modifies autoClickerOutput,
      // the useEffect listening to autoClickerOutput will trigger and update
      // the click rate.  No direct click update needed here.
    }
  };

    const buyMultiplier = (index: number) => {
    const multiplier = multipliers[index];
    if (clicks >= multiplier.cost) {
      setClicks(prevClicks => prevClicks - multiplier.cost);
      const newMultipliers = [...multipliers];
      newMultipliers[index] = {
        ...multiplier,
        level: multiplier.level + 1,
        cost: Math.floor(multiplier.cost * 1.5),
      };
      setMultipliers(newMultipliers);
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
        <ThemedText type="title"><Text>Clicks: {clicksSharedValue.value}</Text></ThemedText> {/* Wrap with Text */}

        <Animated.View style={[buttonAnimatedStyle]}>
          <Button mode="contained" onPress={handleButtonClick}>
            <Text>Click Me!</Text> {/* Wrap with Text */}
          </Button>
        </Animated.View>

        <ThemedText><Text>Auto Clicks/Second: {autoClickerOutput}</Text></ThemedText> {/* Updated! */}
        <ThemedText><Text>Auto-Clickers: {autoClickers}</Text></ThemedText> {/* Wrap with Text */}
        <Button
          mode="contained"
          onPress={buyAutoClicker}
          disabled={clicks < autoClickerCost}
          style={[styles.button, clicks < autoClickerCost && styles.disabledButton]}
        >
          <Text>Buy Auto-Clicker ({autoClickerCost} clicks)</Text> {/* Wrap with Text */}
        </Button>

        <ThemedView style={styles.upgradesContainer}>
        {upgrades.map((upgrade, index) => (
          <View key={index} style={styles.upgradeItem}>
            <Button
              mode="contained"
              onPress={() => buyUpgrade(index)}
              disabled={clicks < upgrade.cost}
              style={[styles.upgradeButton, clicks < upgrade.cost && styles.disabledUpgradeButton]}
            >
              <Text>
                {upgrade.name} ({upgrade.cost} clicks)
              </Text>
            </Button>
          </View>
        ))}
      </ThemedView>

        <ThemedView style={styles.multipliersContainer}>
          {multipliers.map((multiplier, index) => (
            <View key={index} style={styles.multiplierItem}>
              <Button
                mode="contained"
                onPress={() => buyMultiplier(index)}
                disabled={clicks < multiplier.cost}
                style={[styles.button, clicks < multiplier.cost && styles.disabledButton]}
              >
                <Text>
                  {multiplier.name} (Level {multiplier.level}) ({multiplier.cost} clicks)
                </Text>
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
  multipliersContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  multiplierItem: {
    width: '100%',
    marginBottom: 10,
  },
});