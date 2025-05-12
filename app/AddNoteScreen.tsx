import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const NOTES_STORAGE_KEY = '@notes';

const AddNoteScreen: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>('');
  const router = useRouter();

  // Função para formatar a data no mesmo padrão (ex: "01 Jan 2025")
  const getFormattedDate = (): string => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Salva a nota utilizando a data atual como chave
  const handleSave = async () => {
    const date = getFormattedDate();
    if (text.trim()) {
      try {
        const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
        let notes: Record<string, string> = {};
        if (storedNotes) {
          notes = JSON.parse(storedNotes);
        }
        notes[date] = text;
        await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
        router.back(); // Volta para a tela do diário após salvar
      } catch (error) {
        console.error('Erro ao salvar a nota:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />
      
      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Nota</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.label}>Escreva sua nota:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Digite sua nota aqui..."
        placeholderTextColor="#AAAAAA"
        multiline
        value={text}
        onChangeText={setText}
        textAlignVertical="top"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fundo branco
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#333333',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Helvetica',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  textInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1E9AA1',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 30,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
