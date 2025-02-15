import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>Idle Clicker Game</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        padding: 20,
        backgroundColor: '#61dafb',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        zIndex: 1,
    },
    headerText: {
        fontSize: 24,
        color: '#282c34',
    },
});

export default Header;
