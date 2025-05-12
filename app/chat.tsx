import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const ChatScreen: React.FC = (): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Oi, eu sou a Serena 🌸\nEstou aqui para te ouvir e te acolher. Se quiser desabafar, contar como foi seu dia ou simplesmente conversar, estou aqui por você. Fique à vontade 💜',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async (): Promise<void> => {
    if (isLoading || !input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Scroll para a última mensagem
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer SUA_CHAVE_AQUI', // 🔒 Nunca exponha sua chave real no frontend!
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: newMessages,
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const aiMessage = data.choices[0].message as Message;
        setMessages([...newMessages, aiMessage]);
      } else {
        console.error('Erro na resposta da IA:', data);
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: '⚠️ Desculpe, não consegui responder agora. Tente novamente mais tarde.',
          },
        ]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '😢 Ops! Algo deu errado. Verifique sua conexão e tente de novo.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessible
          accessibilityLabel="Botão para voltar"
        >
          <Feather name="arrow-left" size={24} color="#555" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageRow,
                msg.role === 'user' ? styles.userRow : styles.assistantRow,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.role === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.content}</Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color="#1E9AA1" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua mensagem..."
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={isLoading}
            accessible
            accessibilityLabel="Botão para enviar mensagem"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  aiMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#1E9AA1',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    alignItems: 'center',
    marginTop: 10,
  },
});
