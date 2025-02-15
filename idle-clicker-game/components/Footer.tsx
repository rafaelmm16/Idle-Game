import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2023 Idle Clicker Game</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#61dafb',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  footerText: {
    fontSize: 14,
    color: '#282c34',
  },
});

export default Footer;
