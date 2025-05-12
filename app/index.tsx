import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../assets/images/logo.png";

const LoginScreen: React.FC = (): JSX.Element => {
  const [nome, setNome] = useState<string>("");
  const router = useRouter();

  // Ao montar, verificar se já existe usuário salvo
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("userName");
        if (saved) {
          // Preenche o input e navega automaticamente
          setNome(saved);
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.error("Erro ao ler usuário salvo:", error);
      }
    })();
  }, []);

  const handleLogin = async (): Promise<void> => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Por favor, digite um nome de usuário válido.");
      return;
    }

    try {
      await AsyncStorage.setItem("userName", nome.trim());
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Erro", "Algo deu errado ao fazer login. Tente novamente.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar style="auto" />
      <Image style={styles.logoImage} source={Logo} />

      <View style={styles.box}>
        <Text style={styles.welcomeText}>Bem-Vindo ao Serene!</Text>

        <Text style={styles.label}>Nome de Usuário</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu usuário"
          placeholderTextColor="#A0A0A0"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFFFF",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  box: {
    width: "90%",
    minHeight: 400,
    borderRadius: 20,
    backgroundColor: "#DCEFF2",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
  },
  label: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#1E9AA1",
    marginBottom: 10,
    alignSelf: "center",
  },
  input: {
    width: "90%",
    fontSize: 16,
    padding: 10,
    borderColor: "#1E9AA2",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    color: "#1E9AA2",
    marginBottom: 20,
  },
  logoImage: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E9AA4",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "90%",
    backgroundColor: "#1E9AA2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
