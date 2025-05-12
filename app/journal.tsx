import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

interface Note { title: string; content: string }
type NotesMap = Record<string, Note>;

const NOTES_STORAGE_KEY = '@notes';

const DiaryScreen: React.FC = (): JSX.Element => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState<NotesMap>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchText, setSearchText] = useState('');
  const titleRef = useRef<TextInput>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
        if (stored) setNotes(JSON.parse(stored));
      } catch (e) {
        console.error('Erro ao carregar notas', e);
      }
    })();
  }, []);

  const filteredNotes = useMemo(() => {
    const q = searchText.toLowerCase();
    return Object.entries(notes)
      .filter(([_, note]) =>
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q)
      )
      .sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [notes, searchText]);

  const handleAdd = async () => {
    const key = new Date().toISOString();
    const newNotes = { ...notes, [key]: { title: '', content: '' } };
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(newNotes));
      setNotes(newNotes);
      setSelectedKey(key);
      setTitle('');
      setContent('');
      setTimeout(() => titleRef.current?.focus(), 100);
    } catch (e) {
      console.error('Erro ao adicionar nota', e);
    }
  };

  const handleSave = async () => {
    if (!selectedKey) return;
    const updated = {
      ...notes,
      [selectedKey]: { title, content },
    };
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
      setNotes(updated);
      setSelectedKey(null);
      setTitle('');
      setContent('');
    } catch (e) {
      console.error('Erro ao salvar nota', e);
      Alert.alert('Erro', 'Não foi possível salvar a nota.');
    }
  };

  const handleDelete = (key: string) => {
    Alert.alert('Confirmar', 'Excluir esta nota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            const copy = { ...notes };
            delete copy[key];
            await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(copy));
            setNotes(copy);
            if (selectedKey === key) setSelectedKey(null);
          } catch (e) {
            console.error('Erro ao deletar nota', e);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item: [date, note] }: { item: [string, Note] }) => {
    const preview = note.title || note.content.split('\n')[0] || '(Sem título)';
    return (
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => {
          setSelectedKey(date);
          setTitle(note.title);
          setContent(note.content);
        }}
      >
        <View style={styles.noteInfo}>
          <Text style={styles.noteDate}>
            {new Date(date).toLocaleDateString()}
          </Text>
          <Text style={styles.notePreview} numberOfLines={1}>
            {preview}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(date)}
        >
          <Feather name="trash-2" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diário</Text>
        <View style={styles.backButton} />
      </View>

      {/* Campo de Busca (80% largura) */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar nota..."
          placeholderTextColor="#BDBDBD"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de Notas */}
      <FlatList
        data={filteredNotes}
        keyExtractor={([date]) => date}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>Nenhuma nota encontrada.</Text>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Editor */}
      {selectedKey && (
        <View style={styles.editorContainer}>
          <Text style={styles.editingTitle}>Editando Nota</Text>
          <TextInput
            ref={titleRef}
            style={styles.input}
            placeholder="Título"
            placeholderTextColor="#BDBDBD"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Conteúdo"
            placeholderTextColor="#BDBDBD"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedKey(null)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <Feather name="plus" size={30} color="#FFF" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default DiaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,          // área de toque maior
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%',         // reduzido para 80% da largura
    alignSelf: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  noteInfo: {
    flex: 1,
    paddingRight: 10,
  },
  noteDate: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
  },
  notePreview: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 8,
  },
  editorContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginTop: 20,
  },
  editingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#888',
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#1E9AA1',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 16,
  },
});
