import React, { useState, useRef } from 'react';
import { Text, View, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';

interface ExploreSettings {
    notifications: boolean;
    darkTheme: boolean;
    language: string;
}

const Explore: React.FC = () => {
    const [settings, setSettings] = useState<ExploreSettings>({
        notifications: true,
        darkTheme: false,
        language: 'pt-BR',
    });

    const pickerRef = useRef<Picker>(null);

    const handleChange = <K extends keyof ExploreSettings>(key: K, value: ExploreSettings[K]) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: value,
        }));
    };

    const containerStyles = StyleSheet.create({
        light: {
            flex: 1, // Fill the entire screen
            padding: 20,
            backgroundColor: 'white',
        },
        dark: {
            flex: 1, // Fill the entire screen
            padding: 20,
            backgroundColor: 'black',
        },
    });

    const textStyles = StyleSheet.create({
        light: {
            color: 'black',
        },
        dark: {
            color: 'white',
        },
    });

    return (
        <View style={settings.darkTheme ? containerStyles.dark : containerStyles.light}>
            <Text style={[styles.title, settings.darkTheme ? textStyles.dark : textStyles.light]}>Configurações</Text>

            <View style={styles.setting}>
                <Text style={settings.darkTheme ? textStyles.dark : textStyles.light}>Notificações:</Text>
                <Switch
                    value={settings.notifications}
                    onValueChange={(value) => handleChange('notifications', value)}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={settings.notifications ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                />
            </View>

            <View style={styles.setting}>
                <Text style={settings.darkTheme ? textStyles.dark : textStyles.light}>Tema Escuro:</Text>
                <Switch
                    value={settings.darkTheme}
                    onValueChange={(value) => handleChange('darkTheme', value)}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={settings.darkTheme ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                />
            </View>

            <View style={styles.setting}>
                <Text style={settings.darkTheme ? textStyles.dark : textStyles.light}>Idioma:</Text>
                <Picker
                    selectedValue={settings.language}
                    onValueChange={(value) => handleChange('language', value as ExploreSettings['language'])}
                    style={[styles.picker, settings.darkTheme ? { color: 'white', backgroundColor: 'gray' } : { backgroundColor: 'white' }]} // Include background color change
                    ref={pickerRef}
                >
                    <Picker.Item color={settings.darkTheme ? 'white' : 'black'} label="Português (Brasil)" value="pt-BR" />
                    <Picker.Item color={settings.darkTheme ? 'white' : 'black'} label="Inglês (EUA)" value="en-US" />
                    <Picker.Item color={settings.darkTheme ? 'white' : 'black'} label="Espanhol (Espanha)" value="es-ES" />
                </Picker>
            </View>

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    settings.darkTheme ? styles.darkButton : styles.lightButton
                ]}
                onPress={() => {
                    console.log('Salvar configurações:', settings);
                    alert('Configurações salvas!');
                }}
            >
                <Text style={settings.darkTheme ? styles.darkButtonText : styles.lightButtonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    setting: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    picker: { height: 50, width: 150 },
    saveButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20, // Add margin
    },
    lightButton: {
        backgroundColor: 'blue',
    },
    darkButton: {
        backgroundColor: 'gray',
    },
    lightButtonText: {
        color: 'white',
    },
    darkButtonText: {
        color: 'black',
    },
});

export default Explore;