import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TP Expo + Leaflet</Text>
      <Text style={styles.subtitle}>Tabs + WebView + OpenStreetMap</Text>
      <Button title="Voir la carte" onPress={() => navigation.navigate('Carte')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, opacity: 0.7, marginBottom: 8 },
});
