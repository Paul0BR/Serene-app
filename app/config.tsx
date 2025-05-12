import React, { useState, useEffect, ReactNode, FC } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  TextInput,
  Modal,
  Linking,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

const USERNAME_KEY = 'userName';

const ConfigScreen: FC = (): JSX.Element => {
  const [username, setUsername] = useState<string>('Usuário');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [aboutVisible, setAboutVisible] = useState<boolean>(false);
  const [pixVisible, setPixVisible] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(USERNAME_KEY);
        if (stored) {
          setUsername(stored);
        }
      } catch (e) {
        console.error('Erro ao carregar nome:', e);
      }
    })();
  }, []);

  const handleResetApp = (): void => {
    Alert.alert('Apagar tudo', 'Tem certeza que deseja apagar todos os dados?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            setUsername('Usuário');
          } catch (e) {
            console.error('Erro ao resetar app:', e);
          }
        },
      },
    ]);
  };

  const handleSaveUsername = async (): Promise<void> => {
    const trimmed = newUsername.trim();
    if (trimmed) {
      setUsername(trimmed);
      try {
        await AsyncStorage.setItem(USERNAME_KEY, trimmed);
      } catch (e) {
        console.error('Erro ao salvar nome:', e);
      }
    }
    setModalVisible(false);
  };

  const handleSendFeedback = (): void => {
    const email = 'suporte.app.serene@gmail.com';
    const subject = 'Feedback do app';
    const body = 'Escreva aqui seu feedback...';
    Linking.openURL(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  };

  const copyPixKey = async () => {
    await Clipboard.setStringAsync('4230ea41-8aa4-4692-a8c6-3aceda63e2f1');
    Alert.alert('Pix copiado', 'Chave Pix copiada para a área de transferência.');
  };

  const renderModal = (
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    content: ReactNode
  ): JSX.Element => (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>{content}</View>
        <TouchableOpacity
          style={[styles.saveButton, { marginTop: 20 }]}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.buttonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.header}>Configurações</Text>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setNewUsername(username);
          setModalVisible(true);
        }}
      >
        <Ionicons name="person-outline" size={24} color="#1C1C1E" />
        <Text style={styles.itemText}>Nome: {username}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleResetApp}>
        <Ionicons name="trash-outline" size={24} color="red" />
        <Text style={[styles.itemText, { color: 'red' }]}>Apagar tudo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => setAboutVisible(true)}>
        <Ionicons name="information-circle-outline" size={24} color="#1C1C1E" />
        <Text style={styles.itemText}>Sobre o app</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleSendFeedback}>
        <Ionicons name="chatbox-ellipses-outline" size={24} color="#1C1C1E" />
        <Text style={styles.itemText}>Enviar feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => setPixVisible(true)}>
        <Ionicons name="heart-outline" size={24} color="#1C1C1E" />
        <Text style={styles.itemText}>Apoie o projeto (Pix)</Text>
      </TouchableOpacity>

      {renderModal(
        modalVisible,
        setModalVisible,
        <>
          <Text style={styles.modalTitle}>Editar nome</Text>
          <TextInput
            style={styles.input}
            value={newUsername}
            onChangeText={setNewUsername}
            placeholder="Digite seu nome"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveUsername}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {renderModal(
        aboutVisible,
        setAboutVisible,
        <>
          <Text style={styles.modalTitle}>Sobre o app</Text>
          <Text style={styles.aboutText}>
            Bem-vindo ao Serene, um app projetado para cuidar da sua saúde mental e emocional.
            {'\n\n'}Desenvolvedor: Paulo Araujo
            {'\n'}Versão: 1.0.0.0
            {'\n\n'}Política de privacidade:{' '}
            <Text
              style={{ color: 'blue' }}
              onPress={() =>
                Linking.openURL(
                  'https://www.freeprivacypolicy.com/live/33f9c544-02be-4f46-aea5-839c00ffd226'
                )
              }
            >
              clique aqui
            </Text>
          </Text>
        </>
      )}

      {renderModal(
        pixVisible,
        setPixVisible,
        <>
          <Text style={styles.modalTitle}>Apoie o projeto</Text>
          <Text style={styles.aboutText}>
            Se você gosta do app e quer apoiar o desenvolvimento, qualquer valor é bem-vindo!{'\n\n'}
            <Text style={{ fontWeight: 'bold' }}>
              Chave Pix:{'\n'}
              4230ea41-8aa4-4692-a8c6-3aceda63e2f1
            </Text>
          </Text>
          <TouchableOpacity
            style={[styles.saveButton, { marginTop: 15 }]}
            onPress={copyPixKey}
          >
            <Text style={styles.buttonText}>Copiar chave Pix</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default ConfigScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1C1C1E',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
  },
  itemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#1C1C1E',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
  },
});
