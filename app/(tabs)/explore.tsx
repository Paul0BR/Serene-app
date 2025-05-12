import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  bgGradient: string[];
}

const features: Feature[] = [
  {
    title: 'Fale com a Serena',
    description: 'Quando precisar de apoio',
    icon: <Ionicons name="chatbubbles" size={28} color="#fff" />,
    href: '/chat',
    bgGradient: ['#A1C4FD', '#C2E9FB'],
  },
  {
    title: 'Desafio do dia',
    description: 'Nova missão criativa',
    icon: <MaterialIcons name="emoji-objects" size={28} color="#fff" />,
    href: '/video',
    bgGradient: ['#FFEE93', '#FFB347'],
  },
  {
    title: 'Diário',
    description: 'Escreva seu dia',
    icon: <Ionicons name="book" size={28} color="#fff" />,
    href: '/journal',
    bgGradient: ['#FBD3E9', '#BB377D'],
  },
  {
    title: 'Humor Diário',
    description: 'Registre seu humor hoje',
    icon: <Ionicons name="happy" size={28} color="#fff" />,
    href: '/humor',
    bgGradient: ['#89F7FE', '#66A6FF'],
  },
  {
    title: 'Meditação',
    description: 'Paz com áudios relaxantes',
    icon: <Ionicons name="headset" size={28} color="#fff" />,
    href: '/meditation',
    bgGradient: ['#E0EAFC', '#CFDEF3'],
  },
  {
    title: 'Clima',
    description: 'Veja como está o tempo',
    icon: <Ionicons name="partly-sunny" size={28} color="#fff" />,
    href: '/WeatherScreen',
    bgGradient: ['#FDCB82', '#FFA751'],
  },
];

const FunctionsScreen: React.FC = () => {
  const [humorPreview, setHumorPreview] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem('@moods');
        const moods = data ? JSON.parse(data) : {};
        const today = new Date().toISOString().split('T')[0];
        setHumorPreview(moods[today] || '🙂');
      } catch {}
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Explore Tudo</Text>
        <TouchableOpacity onPress={() => router.push('/config')} style={styles.settingsIcon}>
          <Ionicons name="settings-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
        <View style={styles.grid}>
          {features.map((f, i) => (
            <LinearGradient
              key={i}
              colors={f.bgGradient}
              style={[styles.card, { width: windowWidth / 2 - 24 }]}
            >
              <TouchableOpacity
                style={styles.inner}
                onPress={() => router.push(f.href)}
                activeOpacity={0.8}
              >
                <View style={styles.icon}>{f.icon}</View>
                <Text style={styles.cardTitle}>{f.title}</Text>
                <Text style={styles.cardDesc}>{f.description}</Text>
                {f.href === '/humor' && (
                  <Text style={styles.humor}>{humorPreview}</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FunctionsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsIcon: {
    padding: 4,
  },
  container: {
    padding: 18,
    backgroundColor: '#fff',
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    height: 200,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  icon: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardDesc: {
    color: '#fff',
    fontSize: 14,
  },
  humor: {
    fontSize: 36,
    textAlign: 'right',
    color: '#fff',
  },
});
