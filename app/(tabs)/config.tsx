import React, { useEffect, useState } from 'react';
import { Text, View, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExploreSettings {
    notifications: boolean;
    darkTheme: boolean;
    language: string;
}

const Config: React.FC = () => {
    const [settings, setSettings] = useState<ExploreSettings>({
        notifications: true,
        darkTheme: false,
        language: 'pt-BR',
    });

    const handleChange = <K extends keyof ExploreSettings>(key: K, value: ExploreSettings[K]) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: value,
        }));
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('appSettings');
                if (storedSettings) {
                    setSettings(JSON.parse(storedSettings));
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        };

        loadSettings();
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        const saveSettings = async () => {
            try {
                await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
            } catch (error) {
                console.error("Error saving settings:", error);
            }
        };

        saveSettings(); // you might want to debounce or throttle this to avoid excessive saves
    }, [settings]); // This effect runs whenever 'settings' changes

    const containerStyles = StyleSheet.create({
        light: {
            flex: 1,
            padding: 20,
            backgroundColor: 'white',
        },
        dark: {
            flex: 1,
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

    const buttonStyles = StyleSheet.create({
        light: {
            backgroundColor: 'blue',
        },
        dark: {
            backgroundColor: 'gray',
        },
    });

    const buttonTextStyles = StyleSheet.create({
        light: {
            color: 'white',
        },
        dark: {
            color: 'black',
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

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    settings.darkTheme ? buttonStyles.dark : buttonStyles.light
                ]}
                onPress={() => {
                    console.log('Salvar configurações:', settings);
                    alert('Configurações salvas!');
                }}
            >
                <Text style={settings.darkTheme ? buttonTextStyles.dark : buttonTextStyles.light}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    setting: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    saveButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
});

export default Config;