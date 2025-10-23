import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
import Spacer from '../components/ui/Spacer';
import Button from '../components/ui/Button';

const { width } = Dimensions.get('window');
const slides = [
  {
    id: '1',
    title: 'Bienvenue',
    desc: 'Auth & Roles',
  },
  {
    id: '2',
    title: 'Rapide',
    desc: 'CRUD simple',
  },
  {
    id: '3',
    title: 'Sécurisé',
    desc: 'App stock & NFC',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [idx, setIdx] = useState(0);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setIdx(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Spacer h={8} />
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />
      
      <Spacer h={16} />
      
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === idx ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
      
      <Spacer h={16} />
      
      <Button onPress={() => navigation.navigate('Login')}>
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  slide: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  desc: {
    fontSize: 16,
    color: '#6b7280',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: '#2563eb',
  },
  dotInactive: {
    backgroundColor: '#d1d5db',
  },
});