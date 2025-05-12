import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; // Para ícones

const desafios = [
  'Escreva um poema sobre liberdade.',
    'Desenhe algo que represente sua felicidade.',
    'Liste 3 coisas que você aprendeu essa semana.',
    'Escreva uma carta para seu futuro eu.',
    'Crie uma pequena história sobre coragem.',
    'Escreva algo que você gostaria de ouvir quando está triste.',
    'Descreva seu lugar seguro com o máximo de detalhes possíveis.',
    'Escreva uma frase que te motive hoje.',
    'Crie uma lista de sonhos que você tem.',
    'Desenhe sua emoção de agora usando apenas formas geométricas.',
    'Escreva uma música sobre amizade.',
    'Descreva uma memória que te faz sorrir.',
    'Faça um texto sobre o que é amor para você.',
    'Crie uma receita imaginária de felicidade.',
    'Escreva uma história que comece com "Era uma vez uma sombra..."',
    'Liste pessoas que te inspiram e por quê.',
    'Crie um acróstico com seu nome.',
    'Descreva sua personalidade como se fosse um personagem de livro.',
    'Escreva uma carta de gratidão para alguém (mesmo que não envie).',
    'Liste 5 coisas que te fazem bem.',
    'Escreva uma cena de filme que você gostaria de viver.',
    'Crie um final alternativo para um filme que você gosta.',
    'Imagine um lugar mágico e descreva ele.',
    'Escreva um texto usando só perguntas.',
    'Desenhe um símbolo que represente sua força interior.',
    'Escreva uma história baseada em um sonho que você teve.',
    'Crie uma poesia com a palavra "vento".',
    'Faça uma lista de coisas que você quer aprender.',
    'Descreva sua vida como se fosse uma série.',
    'Crie um conselho que você gostaria de seguir todos os dias.',
    "Escreva sobre o seu maior sonho e como você pretende alcançá-lo.",
    "Faça uma lista de 5 coisas pelas quais você é grato hoje.",
    "Crie uma história sobre um herói que enfrenta um grande desafio.",
    "Escreva uma carta para alguém que te inspirou.",
    "Descreva seu lugar ideal de descanso e como ele te faz sentir.",
    "Liste 3 coisas que você gostaria de aprender este ano.",
    "Imagine que você pode viajar para qualquer lugar no mundo. Onde iria e por quê?",
    "Escreva sobre um momento que te fez sentir muito orgulhoso de si mesmo.",
    "Crie um pequeno poema sobre um tema aleatório.",
    "Descreva um dia perfeito e o que faria nele.",
    "Faça uma lista de 3 coisas que você pode melhorar em si mesmo.",
    "Escreva sobre um filme ou livro que mudou sua perspectiva.",
    "Desenhe algo que representa a palavra 'amor'.",
    "Crie um mantra ou afirmação positiva que você pode repetir todos os dias.",
    "Escreva uma carta de agradecimento a você mesmo.",
    "Faça uma lista de coisas que te fazem sentir calmo e relaxado.",
    "Crie um personagem fictício e escreva sobre sua aventura mais emocionante.",
    "Escreva sobre um lugar que você quer visitar e por que isso é importante para você.",
    "Descreva como seria um dia na vida de alguém que você admira.",
    "Escreva uma carta de desculpas para você mesmo, pedindo perdão por algo do passado.",
    "Crie um plano para alcançar um objetivo importante na sua vida.",
    "Desenhe algo que simbolize sua força interior.",
    "Escreva um texto sobre a importância de ajudar os outros.",
    "Liste 5 coisas que você pode fazer para melhorar sua autoestima.",
    "Escreva sobre um momento em que você superou um medo.",
    "Crie uma lista de livros ou filmes que você gostaria de ler/ver.",
    "Escreva sobre um talento que você gostaria de desenvolver.",
    "Imagine que você pode ter uma habilidade especial. Qual seria e por quê?",
    "Escreva sobre o que significa 'sucesso' para você.",
    "Faça uma lista de 10 coisas que te fazem feliz.",
    "Escreva sobre uma viagem que você fez e que te deixou memórias inesquecíveis.",
    "Descreva uma situação em que você ajudou alguém e como isso te fez sentir.",
    "Crie um texto sobre como você gostaria de ser lembrado no futuro.",
    "Escreva um poema sobre a natureza.",
    "Liste 5 metas para os próximos 6 meses.",
    "Imagine que você é um líder de uma grande organização. Como lideraria os outros?",
    "Escreva sobre uma habilidade que você já aprendeu e como ela mudou sua vida.",
    "Desenhe ou descreva a sua casa dos sonhos.",
    "Crie uma história onde você é o protagonista e faz algo incrível.",
    "Escreva uma carta para seu futuro eu daqui a 5 anos.",
    "Imagine um mundo sem tecnologia e escreva sobre como seria a vida nesse mundo.",
    "Escreva sobre um momento que você se sentiu muito acolhido.",
    "Crie um roteiro de um dia perfeito, começando ao acordar e terminando à noite.",
    "Liste 3 hábitos que você gostaria de cultivar para uma vida mais saudável.",
    "Escreva sobre o que você acha que faria o mundo um lugar melhor.",
    "Crie uma lista de coisas que você gostaria de fazer para se sentir mais realizado.",
    "Descreva uma experiência que fez você aprender algo importante sobre si mesmo.",
    "Escreva sobre a importância de ser gentil com os outros e consigo mesmo.",
    "Crie uma lista de 5 coisas que você pode fazer para se cuidar melhor.",
    "Descreva o que significa ser resiliente e como você pode ser mais resiliente na vida.",
    "Escreva sobre um momento em que você foi desafiado e como lidou com isso.",
    "Liste 5 coisas que você gostaria de aprender sobre um assunto que te interessa.",
    "Imagine que você pode mudar algo no mundo. O que seria e por quê?",
    "Escreva uma carta de encorajamento para um amigo ou familiar.",
    "Crie um pequeno plano de estudo para aprender algo novo em 1 mês.",
    "Descreva uma habilidade que você gostaria de dominar e como começaria a praticá-la.",
    "Escreva sobre a última vez que você se sentiu inspirado e o que isso significou para você.",
    "Crie uma lista de 3 ações diárias que podem melhorar sua produtividade.",
    "Escreva sobre algo que você aprendeu recentemente e como isso mudou sua visão.",
    "Descreva uma situação em que você foi corajoso e o que aprendeu com isso.",
    "Liste 5 livros que você gostaria de ler para seu desenvolvimento pessoal.",
    "Escreva sobre como você se organiza no dia a dia para ser mais produtivo.",
    "Imagine que você é um mentor. O que você diria para alguém que está começando a sua jornada?",
    "Escreva sobre um momento em que você superou uma dificuldade e como fez isso.",
    "Crie uma lista de hábitos saudáveis que você gostaria de incorporar na sua vida.",
    "Descreva como você pode melhorar suas habilidades de comunicação.",
    "Escreva sobre a importância da empatia em suas relações pessoais e profissionais.",
    "Liste 3 coisas que você faria para aumentar sua confiança pessoal.",
    "Descreva uma meta de longo prazo que você tem e como planeja alcançá-la.",
    "Escreva sobre um erro que você cometeu e o que aprendeu com ele.",
    "Imagine que você tem 1 hora livre todo dia. Como usaria esse tempo?",
    "Escreva sobre a importância de manter uma mente aberta para novas ideias.",
    "Crie um plano de ação para melhorar uma área específica da sua vida.",
    "Descreva um hábito que você gostaria de abandonar e o que faria para conseguir isso.",
    "Escreva sobre uma pessoa que você admira e o que você pode aprender com ela.",
    "Liste 5 coisas que você pode fazer para aumentar sua motivação.",
    "Descreva o que significa para você ter sucesso na vida.",
    "Crie um pequeno projeto que você possa realizar em uma semana e descreva os passos.",
    "Escreva sobre o que te impede de alcançar seus objetivos e como pode superar esses obstáculos.",
    "Descreva um momento em que você teve que tomar uma decisão difícil e o que aprendeu com isso.",
    "Liste 3 formas de aumentar sua produtividade no trabalho ou nos estudos.",
    "Escreva sobre o que significa para você ser disciplinado.",
    "Crie uma lista de 5 coisas que você pode fazer para melhorar sua saúde mental.",
    "Escreva sobre o papel da paciência em seu processo de crescimento pessoal.",
    "Descreva como seria a sua vida ideal e o que você precisa mudar para chegar lá.",
    "Escreva sobre a importância de estabelecer metas para alcançar seus sonhos.",
    "Crie um plano para aprender uma nova habilidade no próximo mês.",
    "Escreva sobre como você lida com a pressão e como melhorar essa habilidade.",
    "Descreva o que significa para você ter equilíbrio na vida.",
    "Liste 5 maneiras de ser mais produtivo em um dia de trabalho ou estudo.",
    "Escreva sobre como a meditação ou mindfulness pode beneficiar sua rotina.",
    "Crie um desafio pessoal para melhorar uma habilidade ou hábito e escreva como irá alcançá-lo.",
    "Escreva sobre o impacto positivo de uma rotina matinal bem definida.",
    "Liste 3 coisas que você pode fazer para manter uma mente mais focada.",
    "Descreva o que você gostaria de ensinar aos outros e por que isso é importante para você.",
    "Escreva sobre um momento em que você ajudou alguém e o que isso significou para você.",
    "Liste 5 maneiras de cuidar melhor de sua saúde física e mental.",
    "Escreva sobre um livro ou artigo que mudou sua maneira de pensar e por que ele teve esse impacto.",
    "Descreva um hábito negativo que você gostaria de mudar e o que faria para isso.",
    "Escreva sobre um hobby ou interesse que você gostaria de explorar mais a fundo.",
    "Liste 3 maneiras de manter um equilíbrio entre vida profissional, estudos e lazer.",
    "Escreva sobre a importância da persistência na busca pelos seus objetivos."
];

const STORAGE_KEY = '@start_date';

const getDaysSince = (startDate: Date): number => {
  const today = new Date();
  const diff =
    Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function DesafioDoDia() {
  const [indexHoje, setIndexHoje] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const setupDayIndex = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        let start: Date;
        if (stored) {
          start = new Date(stored);
        } else {
          start = new Date();
          await AsyncStorage.setItem(STORAGE_KEY, start.toISOString());
        }
        const idx = getDaysSince(start);
        setIndexHoje(idx < desafios.length ? idx : desafios.length - 1);
      } catch (e) {
        console.error(e);
      }
    };
    setupDayIndex();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Desafio Diário</Text>
        {/* placeholder para centro */}
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Dia atual */}
        <Text style={styles.dayText}>Dia {indexHoje + 1}</Text>

        {/* Cartão do desafio de hoje */}
        <View style={styles.card}>
          <Text style={styles.desafioText}>{desafios[indexHoje]}</Text>
          <TouchableOpacity
            style={styles.writeButton}
            onPress={() => router.push('/journal')}
          >
            <Text style={styles.writeButtonText}>Escrever</Text>
            <Feather
              name="edit"
              size={20}
              color="#fff"
              style={styles.writeButtonIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Próximos desafios */}
        <Text style={styles.proximosTitle}>Próximos Desafios</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.proximosScroll}
        >
          {desafios.slice(indexHoje + 1).map((_, idx) => (
            <View key={idx} style={styles.proximoCard}>
              <Text style={styles.proximoText}>
                Dia {indexHoje + idx + 2}
              </Text>
              <Feather name="lock" size={18} color="#aaa" />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
  },
  content: { padding: 16 },
  dayText: {
    fontSize: 18,
    color: '#777',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  desafioText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
  },
  writeButton: {
    marginTop: 20,
    backgroundColor: '#1E9AA1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  writeButtonIcon: {
    marginLeft: 5,
  },
  proximosTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 15,
    color: '#555',
  },
  proximosScroll: {
    paddingBottom: 10,
  },
  proximoCard: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proximoText: {
    fontSize: 16,
    color: '#777',
  },
});
