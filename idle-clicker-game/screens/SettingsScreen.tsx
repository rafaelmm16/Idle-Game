import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const SettingsScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const [volume, setVolume] = useState(50);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [gameMode, setGameMode] = useState('normal');

  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState);
  const toggleTheme = () => setIsDarkTheme(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      
      <View style={styles.setting}>
        <Text style={styles.settingText}>Idioma</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          <Picker.Item label="Português" value="pt" />
          <Picker.Item label="Inglês" value="en" />
          <Picker.Item label="Espanhol" value="es" />
        </Picker>
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={volume}
          onValueChange={(value) => setVolume(value)}
        />
        <Text style={styles.sliderValue}>{Math.round(volume)}</Text>
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Notificações</Text>
        <Switch
          onValueChange={toggleNotifications}
          value={isNotificationsEnabled}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Tema Escuro</Text>
        <Switch
          onValueChange={toggleTheme}
          value={isDarkTheme}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Modo de Jogo</Text>
        <Picker
          selectedValue={gameMode}
          style={styles.picker}
          onValueChange={(itemValue) => setGameMode(itemValue)}
        >
          <Picker.Item label="Normal" value="normal" />
          <Picker.Item label="Hardcore" value="hardcore" />
        </Picker>
      </View>
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
  setting: {
    marginVertical: 10,
    width: '80%',
  },
  settingText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#ffffff',
    backgroundColor: '#3a3f47',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default SettingsScreen;
