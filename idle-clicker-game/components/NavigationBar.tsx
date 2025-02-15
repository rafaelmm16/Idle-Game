import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const NavigationBar = ({ currentTab, setCurrentTab }) => {
    return (
        <View style={styles.navBar}>
            <TouchableOpacity
                style={[styles.navButton, currentTab === 'game' && styles.activeTab]}
                onPress={() => setCurrentTab('game')}
            >
                <FontAwesome name="gamepad" size={24} color={currentTab === 'game' ? '#282c34' : '#ffffff'} />
                <Text style={styles.navButtonText}>Jogo</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.navButton, currentTab === 'shop' && styles.activeTab]}
                onPress={() => setCurrentTab('shop')}
            >
                <FontAwesome name="shopping-cart" size={24} color={currentTab === 'shop' ? '#282c34' : '#ffffff'} />
                <Text style={styles.navButtonText}>Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.navButton, currentTab === 'settings' && styles.activeTab]}
                onPress={() => setCurrentTab('settings')}
            >
                <FontAwesome name="cogs" size={24} color={currentTab === 'settings' ? '#282c34' : '#ffffff'} />
                <Text style={styles.navButtonText}>Configurações</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#61dafb',
        paddingVertical: 10,
    },
    navButton: {
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 16,
        color: '#ffffff',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#282c34',
    },
});

export default NavigationBar;
