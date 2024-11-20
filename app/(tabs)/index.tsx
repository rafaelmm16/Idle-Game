import { Image, StyleSheet, Platform, Text, View, Animated, AppState, AppStateStatus } from 'react-native'; // Import AppState
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from 'react-native-paper';
import React, { useState, useEffect } from 'react'; // Removed useRef
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true); // Add a loading state
  const [clicks, setClicks] = useState(0);
  const [clicksPerSecond, setClicksPerSecond] = useState(0);
  const [autoClickers, setAutoClickers] = useState(0);
  const [autoClickerCost, setAutoClickerCost] = useState(10);
  const [upgrades, setUpgrades] = useState([
    { name: 'Enhanced Clicking', cost: 100, cpsBoost: 5 },
    { name: 'Super Clicks', cost: 500, cpsBoost: 20 },
    { name: 'Mega Clicks', cost: 2000, cpsBoost: 100 },
  ]);

  const clicksSharedValue = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(buttonScale.value, { duration: 100 }) }],
    };
  });

  useEffect(() => {
    clicksSharedValue.value = clicks;
  }, [clicks]);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (clicksPerSecond > 0) {
      interval = setInterval(() => {
        setClicks(prevClicks => {
          const newClicks = prevClicks + clicksPerSecond;
          clicksSharedValue.value = newClicks;
          return newClicks;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [clicksPerSecond]);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const savedClicks = await AsyncStorage.getItem('clicks');
        const savedAutoClickers = await AsyncStorage.getItem('autoClickers');
        const savedAutoClickerCost = await AsyncStorage.getItem('autoClickerCost');
        const savedUpgrades = await AsyncStorage.getItem('upgrades');

        if (savedClicks !== null) {
          const parsedClicks = parseInt(savedClicks, 10);
          setClicks(parsedClicks);
          clicksSharedValue.value = parsedClicks; 
        }
        if (savedAutoClickers !== null) {
          const parsedAutoClickers = parseInt(savedAutoClickers, 10);
          setAutoClickers(parsedAutoClickers);
          setClicksPerSecond(parsedAutoClickers); 
        }
        if (savedAutoClickerCost !== null) {
          setAutoClickerCost(parseInt(savedAutoClickerCost, 10));
        }
        if (savedUpgrades !== null) {
          const parsedUpgrades = JSON.parse(savedUpgrades);
          setUpgrades(parsedUpgrades);

          let totalCpsBoost = 0;
          parsedUpgrades.forEach((upgrade: { cpsBoost: number; }) => { // No need to re-parse here
            totalCpsBoost += upgrade.cpsBoost;
          });
          setClicksPerSecond(clicksPerSecond + totalCpsBoost); // Add to existing CPS
        }
      } catch (error) {
        console.error('Error loading game data:', error);
      } finally {
        setLoading(false); 
      }
    };

    loadGameData();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const saveGameData = async () => {
      try {
        await AsyncStorage.setItem('clicks', clicks.toString());
        await AsyncStorage.setItem('autoClickers', autoClickers.toString());
        await AsyncStorage.setItem('autoClickerCost', autoClickerCost.toString());
        await AsyncStorage.setItem('upgrades', JSON.stringify(upgrades));
      } catch (error) {
        console.error('Error saving game data:', error);
      }
    };

    // Save every 5 seconds (adjust as needed)
    const saveInterval = setInterval(saveGameData, 5000);

    const appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => { // Type the nextAppState parameter
      if (nextAppState !== 'active') {
        saveGameData();
      }
    });

    return () => {
      clearInterval(saveInterval);
      appStateSubscription.remove(); // Use remove() on the subscription
    };
  }, [clicks, autoClickers, autoClickerCost, upgrades]);

  if (loading) { // Show a loading indicator while loading data
    return <View><Text>Loading...</Text></View>;
  }

  const handleButtonClick = () => {
    buttonScale.value = 0.9;
    setTimeout(() => {
      buttonScale.value = 1;
    }, 100);
    setClicks(prevClicks => prevClicks + 1);
  };

  const buyAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      setClicks(prevClicks => prevClicks - autoClickerCost);
      setAutoClickers(prevAutoClickers => prevAutoClickers + 1);
      setClicksPerSecond(prevCPS => prevCPS + 1);
      setAutoClickerCost(prevCost => Math.floor(prevCost * 1.15));
    }
  };

  const buyUpgrade = (index: number) => {
    const upgrade = upgrades[index];
    if (clicks >= upgrade.cost) {
      setClicks(prevClicks => prevClicks - upgrade.cost);
      setClicksPerSecond(prevCPS => prevCPS + upgrade.cpsBoost);
      const newUpgrades = [...upgrades];
      newUpgrades[index] = { ...upgrade, cost: Math.floor(upgrade.cost * 1.5) };
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
        <ThemedText type="title"><Text>Clicks: {clicksSharedValue.value}</Text></ThemedText> {/* Wrap with Text */}

        <Animated.View style={[buttonAnimatedStyle]}>
          <Button mode="contained" onPress={handleButtonClick}>
            <Text>Click Me!</Text> {/* Wrap with Text */}
          </Button>
        </Animated.View>

        <ThemedText><Text>Clicks Per Second: {clicksPerSecond}</Text></ThemedText> {/* Wrap with Text */}
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
                style={[styles.button, clicks < upgrade.cost && styles.disabledButton]}
              >
                <Text>{upgrade.name} ({upgrade.cost} clicks)</Text> {/* Wrap with Text */}
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