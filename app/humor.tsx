import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';

if (!LocaleConfig.locales['pt']) {
  LocaleConfig.locales['pt'] = {
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ],
    dayNames: [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
  };
}
LocaleConfig.defaultLocale = 'pt';

const MOODS_KEY = '@moods';
const MOOD_VALUES: Record<string, number> = { '😀': 5, '🙂': 4, '😐': 3, '😔': 2, '😢': 1 };
const MOOD_LABELS: Record<number, string> = { 5: '😀', 4: '🙂', 3: '😐', 2: '😔', 1: '😢' };

const HumorScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [moods, setMoods] = useState<Record<string, string>>({});
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [labels, setLabels] = useState<string[]>([]);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [monthlyCounts, setMonthlyCounts] = useState<Record<number, number>>({});
  const [currentMonth, setCurrentMonth] = useState<{ year: number, month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(MOODS_KEY);
      setMoods(raw ? JSON.parse(raw) : {});
    })();
  }, []);

  useEffect(() => {
    const { year, month } = currentMonth;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const entries = Object.entries(moods)
      .filter(([date]) => date.startsWith(monthStr))
      .sort((a, b) => a[0].localeCompare(b[0]));

    const days = entries.map(([date]) => parseInt(date.slice(8), 10).toString());
    const values = entries.map(([, m]) => MOOD_VALUES[m] || 0);
    const maxLabels = 10;
    const step = Math.ceil(days.length / maxLabels) || 1;
    const sampledLabels = days.map((d, i) => i % step === 0 ? d : '');
    setLabels(sampledLabels);
    setDataPoints(values);

    const counts: Record<number, number> = {};
    values.forEach(val => { counts[val] = (counts[val] || 0) + 1; });
    const total = values.length;
    const pct: Record<number, number> = {};
    Object.entries(counts).forEach(([val, count]) => { pct[Number(val)] = Math.round((count / total) * 100); });
    setMonthlyCounts(pct);
  }, [moods, currentMonth]);

  const handleDayPress = ({ dateString }: any) => {
    setSelectedDate(prev => prev === dateString ? null : dateString);
    setSelectedMood(moods[dateString] || '');
  };

  const handleSave = async () => {
    if (!selectedDate) return;
    const updated = { ...moods, [selectedDate]: selectedMood };
    await AsyncStorage.setItem(MOODS_KEY, JSON.stringify(updated));
    setSelectedDate(null);
    setMoods(updated);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Voltar</Text></TouchableOpacity>
      <Text style={styles.title}>Humor</Text>
      <Calendar
        current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-01`}
        onMonthChange={({ year, month }) => setCurrentMonth({ year, month })}
        dayComponent={({ date, state }) => {
          const m = moods[date.dateString];
          const isSel = selectedDate === date.dateString;
          const isToday = date.dateString === new Date().toISOString().split('T')[0];
          return (
            <TouchableOpacity
              style={[styles.dayContainer, isSel && styles.selectedDay, isToday && styles.today]}
              onPress={() => handleDayPress(date)}>
              <Text style={[styles.dayText, isSel && styles.selectedText, isToday && styles.todayText]}> {m || date.day} </Text>
            </TouchableOpacity>
          );
        }}
        markingType="simple"
        markedDates={selectedDate ? { [selectedDate]: { selected: true } } : {}}
        style={styles.calendar}
      />
      {selectedDate && (
        <View style={styles.selection}>
          <Text style={styles.selectionTitle}>Humor para {selectedDate}</Text>
          <View style={styles.moodRow}>{[5, 4, 3, 2, 1].map(val => {
            const emoji = MOOD_LABELS[val];
            return (
              <TouchableOpacity key={val}
                style={[styles.moodBtn, selectedMood === emoji && styles.moodSel]}
                onPress={() => setSelectedMood(emoji)}>
                <Text style={styles.moodText}>{emoji}</Text>
              </TouchableOpacity>
            );
          })}</View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveTxt}>Salvar</Text></TouchableOpacity>
        </View>
      )}
      <Text style={styles.chartTitle}>Gráfico ({currentMonth.month}/{currentMonth.year})</Text>
      {dataPoints.length > 0 ? (
        <>
          <LineChart
            data={{ labels, datasets: [{ data: dataPoints }] }}
            width={Dimensions.get('window').width}
            height={220}
            chartConfig={{ backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', decimalPlaces: 0, color: (op = 1) => `rgba(30,154,161,${op})`, labelColor: (op = 1) => `rgba(0,0,0,${op})` }}
            style={styles.chart}
            bezier
          />
          <View style={styles.legend}>
            {Object.entries(MOOD_VALUES).map(([emoji, val]) => (
              <View key={val} style={styles.legendItem}>
                <Text style={styles.legendEmoji}>{emoji}</Text>
                <Text style={styles.legendLabel}>{val}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.summaryTitle}>Resumo mensal</Text>
          <View style={styles.summary}>
            {Object.entries(monthlyCounts).map(([val, pct]) => (
              <Text key={val} style={styles.summaryText}>
                {MOOD_LABELS[Number(val)]}: {pct}%
              </Text>
            ))}
          </View>
        </>
      ) : <Text style={styles.noData}>Sem dados neste mês</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  back: { color: '#00adf5', marginBottom: 8, marginLeft: 12, fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  calendar: { marginBottom: 16 },
  dayContainer: { alignItems: 'center', justifyContent: 'center', width: 32, height: 32 },
  selectedDay: { backgroundColor: '#e0f7ff', borderRadius: 16 },
  today: { backgroundColor: '#1E9AA1', borderRadius: 16 },
  dayText: { fontSize: 14 },
  selectedText: { color: '#00adf5', fontWeight: 'bold' },
  todayText: { color: '#fff', fontWeight: 'bold' },
  selection: { marginBottom: 20 },
  selectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  moodRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  moodBtn: { padding: 8, borderRadius: 12, backgroundColor: '#ddd', marginHorizontal: 4 },
  moodSel: { backgroundColor: '#00adf5' },
  moodText: { fontSize: 18 },
  saveBtn: { backgroundColor: '#00adf5', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'center' },
  saveTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
  chartTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 12 },
  chart: { marginVertical: 8 },
  legend: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  legendItem: { alignItems: 'center' },
  legendEmoji: { fontSize: 18 },
  legendLabel: { fontSize: 12, color: '#666' },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 16 },
  summary: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8, flexWrap: 'wrap' },
  summaryText: { fontSize: 14, margin: 4 },
  noData: { textAlign: 'center', color: '#aaa', fontSize: 16, marginTop: 16 },
});

export default HumorScreen;
