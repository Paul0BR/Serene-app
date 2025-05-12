import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const MeditationSearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();

  const searchDeezer = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(`https://api.deezer.com/search?q=meditação ${query}`);
      const json = await response.json();
      if (json.data && Array.isArray(json.data)) {
        setResults(json.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Erro ao buscar faixas:', error);
    }
    setLoading(false);
  };

  const togglePlay = async (item: any) => {
    try {
      if (playingId === item.id) {
        await soundRef.current?.pauseAsync();
        setPlayingId(null);
        return;
      }

      // Para o áudio anterior, se houver
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync({ uri: item.preview });
      soundRef.current = sound;
      await sound.playAsync();
      setPlayingId(item.id);

      // Quando acabar, resetar
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
        }
      });

    } catch (error) {
      console.error('Erro ao tocar faixa:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
      </TouchableOpacity>

      <Text style={styles.title}>Buscar Meditação</Text>
      <TextInput
        placeholder="Digite algo para meditar..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchDeezer}
        returnKeyType="search"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#1C1C1E" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => togglePlay(item)}>
              <View>
                <Text style={styles.trackTitle}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist.name}</Text>
              </View>
              <Ionicons
                name={playingId === item.id ? 'pause-circle' : 'play-circle'}
                size={28}
                color="#1C1C1E"
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>Nenhum resultado encontrado.</Text>
          }
        />
      )}
    </View>
  );
};

export default MeditationSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  artist: {
    fontSize: 14,
    color: '#888',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
