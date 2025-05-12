import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useColor } from '../context/ColorContext';

interface IconData {
  name: string;
  label: string;
  colors: [string, string];
}

const iconData: IconData[] = [
  { name: 'sunny-outline', label: 'Feliz', colors: ['#FED901', '#FD8101'] },
  { name: 'cloud-outline', label: 'Calmo', colors: ['#04E6FF', '#0B818E'] },
  { name: 'flame-outline', label: 'Estressado', colors: ['#CD0615', '#770430'] },
  { name: 'flash-outline', label: 'Ansioso', colors: ['#EB5402', '#CC1A02'] },
  { name: 'moon-outline', label: 'Chateado', colors: ['#9A07FB', '#080481'] },
  { name: 'water-outline', label: 'Triste', colors: ['#D2D2D2', '#4F4F4F'] },
  { name: 'heart-outline', label: 'Empolgado', colors: ['#FF6F61', '#FF4C35'] },
  { name: 'help-circle-outline', label: 'Confuso', colors: ['#58A4B0', '#2C3E50'] },
  { name: 'alert-circle-outline', label: 'Apreensivo', colors: ['#F2D0A4', '#E27D60'] },
  { name: 'megaphone-outline', label: 'Surpreso', colors: ['#F3A683', '#F7B7A3'] },
  { name: 'checkmark-done-outline', label: 'Aliviado', colors: ['#4CAF50', '#2E8B57'] },
];

const motivationalPhrases: string[] = [
  "Acredite em si mesmo e todo o resto virá naturalmente.",
  "Cada dia é uma nova oportunidade para brilhar.",
  "Transforme seus sonhos em planos e seus planos em ações.",
  "Você é capaz de coisas incríveis.",
  "Hoje é um bom dia para começar algo novo.",
  "Não pare até se orgulhar.",
  "Seja a energia que você deseja atrair.",
  "Lute pelo que te faz feliz.",
  "O sucesso começa com a coragem de tentar.",
  "Mantenha o foco e a determinação.",
  "A cada desafio, uma nova vitória.",
  "Sua persistência determina sua grandeza.",
  "O esforço de hoje prepara suas conquistas de amanhã.",
  "Você é mais forte do que imagina.",
  "Acredite no seu potencial ilimitado.",
  "A felicidade é uma escolha diária.",
  "Persista, pois o melhor sempre está por vir.",
  "Desafie seus limites e cresça.",
  "Sua atitude define seu futuro.",
  "Cada pequeno passo aproxima você do seu sonho.",
  "Seja a diferença que você quer ver.",
  "Confie no processo e siga em frente.",
  "Você transforma o mundo ao seu redor.",
  "Seu esforço é a sua melhor arma.",
  "Levante, sacuda a poeira e continue.",
  "Faça do hoje o melhor dia da sua vida.",
  "Desfrute das pequenas vitórias.",
  "O otimismo é o primeiro passo para o sucesso.",
  "Um sorriso pode iluminar o universo.",
  "Celebre cada conquista, por menor que seja.",
  "Nada é impossível para quem acredita.",
  "O futuro pertence àqueles que se preparam hoje.",
  "Persistência e dedicação são a chave do sucesso.",
  "A paixão transforma tudo ao seu redor.",
  "A jornada importa mais do que o destino.",
  "Sua coragem abre portas para novas oportunidades.",
  "Encare os desafios com confiança e determinação.",
  "O melhor ainda está por vir.",
  "Cada dia é uma nova chance de ser feliz.",
  "Não espere pela oportunidade, crie-a.",
  "A determinação é sua maior aliada.",
  "Faça do seu caminho uma obra-prima.",
  "Seus sonhos não têm limites.",
  "O sucesso vem para aqueles que ousam tentar.",
  "Mantenha a calma e vá em frente.",
  "Você é a inspiração que o mundo precisa.",
  "Transforme sua paixão em ações.",
  "Seu potencial é infinito.",
  "Encontre a beleza em cada momento.",
  "Cada novo dia é uma nova chance de transformar sua vida.",
];

const Home: React.FC = (): JSX.Element => {
  // Calcula o dia do ano para selecionar a frase motivacional
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.valueOf() - startOfYear.valueOf();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const motivationalPhrase = motivationalPhrases[dayOfYear % motivationalPhrases.length];

  const index = useSharedValue(0);
  const animating = useSharedValue(false);

  const { colors, setColors } = useColor();

  const updateColors = (i: number): void => {
    setColors(iconData[i].colors);
  };

  const startAnimation = (): void => {
    if (animating.value) return;
    animating.value = true;

    const nextIndex = (Math.round(index.value) + 1) % iconData.length;

    index.value = withTiming(nextIndex, { duration: 500 }, () => {
      runOnJS(updateColors)(nextIndex);
      animating.value = false;
    });
  };

  const animationStyle = useAnimatedStyle(() => {
    return { opacity: 1 };
  });

  return (
    <View style={styles.pr}>
      <StatusBar />
      <Text style={styles.text}>
        Que bom ver você aqui!{'\n'}Como está se sentindo hoje?
      </Text>
      <Text style={styles.motivationalText}>{motivationalPhrase}</Text>

      <TouchableWithoutFeedback onPress={startAnimation}>
        <Animated.View style={[styles.but, animationStyle]}>
          <LinearGradient
            colors={colors}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          />
          <View style={styles.emojiContainer}>
            <Ionicons
              name={iconData[Math.round(index.value)].name}
              size={120}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.emotionText}>
              {iconData[Math.round(index.value)].label}
            </Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  text: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  motivationalText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#555555',
    marginBottom: 30,
    textAlign: 'center',
  },
  pr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  but: {
    width: 325,
    height: 400,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiContainer: {
    position: 'absolute',
    top: '35%',
    alignItems: 'center',
  },
  icon: {
    opacity: 0.8,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emotionText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    opacity: 0.8,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
