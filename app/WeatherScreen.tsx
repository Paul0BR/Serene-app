import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    SafeAreaView,
    ScrollView,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

interface WeatherData {
    current_weather?: {
        temperature: number;
        windspeed: number;
        weathercode: number;
        is_day: number;
    };
}

interface ForecastDayData {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
}

interface HourlyForecastData {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
}

interface LocationData {
    coords: {
        latitude: number;
        longitude: number;
    };
}

interface ReverseGeocode {
    city?: string;
    subregion?: string;
    region?: string;
    name?: string;
}

const getWeatherUrl = (latitude: number, longitude: number): string =>
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=America%2FSao_Paulo`;

const formatDay = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    return new Intl.DateTimeFormat('pt-BR', options).format(date).toUpperCase();
};

const formatHour = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    return `${hours.toString().padStart(2, '0')}:00`;
};

const WeatherScreen: React.FC = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [weather, setWeather] = useState<WeatherData['current_weather'] | null>(null);
    const [forecast, setForecast] = useState<ForecastDayData | null>(null);
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [city, setCity] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permissão de localização negada');
                    setLoading(false);
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({});
                setLocation(loc);

                const response = await fetch(getWeatherUrl(loc.coords.latitude, loc.coords.longitude));
                const data: {
                    current_weather?: WeatherData['current_weather'];
                    daily?: ForecastDayData;
                    hourly?: HourlyForecastData;
                } = await response.json();
                setWeather(data.current_weather);
                setForecast(data.daily);
                setHourlyForecast(data.hourly);

                const reverseGeocode: ReverseGeocode[] | null = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });
                const place = reverseGeocode?.[0];
                const cityName =
                    place?.city ||
                    place?.subregion ||
                    place?.region ||
                    place?.name ||
                    'Local não identificado';
                setCity(cityName);
            } catch (error) {
                console.error('Erro ao obter dados do clima:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const isDaytime = weather?.is_day === 1;
    const backgroundColor = isDaytime ? '#ADD8E6' : '#2c3e50'; // Azul mais claro
    const textColor = isDaytime ? '#1C1C1E' : '#ecf0f1';

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <StatusBar barStyle={isDaytime ? 'dark-content' : 'light-content'} backgroundColor="transparent" translucent />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={textColor} />
                    </View>
                ) : weather && forecast && hourlyForecast ? (
                    <View style={styles.weatherContainer}>
                        {city && <Text style={[styles.city, { color: textColor }]}>{city}</Text>}
                        {weather.temperature !== undefined && <Text style={[styles.temperature, { color: textColor }]}>{Math.round(weather.temperature)}°C</Text>}
                        {weather.weathercode !== undefined && (
                            <Text style={[styles.description, { color: textColor, textTransform: 'capitalize' }]}>
                                {weather.weathercode === 0 ? 'Céu limpo' : 'Tempo variado'}
                            </Text>
                        )}

                        <View style={styles.detailsContainer}>
                            {weather.windspeed !== undefined && (
                                <View style={styles.detailItem}>
                                    <Ionicons name="wind" size={20} color={textColor} style={styles.detailIcon} />
                                    <Text style={[styles.detailText, { color: textColor }]}>{Math.round(weather.windspeed)} km/h</Text>
                                </View>
                            )}
                            {forecast.precipitation_probability_max && (
                                <View style={styles.detailItem}>
                                    <Ionicons name="umbrella-outline" size={20} color={textColor} style={styles.detailIcon} />
                                    <Text style={[styles.detailText, { color: textColor }]}>{forecast.precipitation_probability_max?.[0] ?? '--'}%</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.hourlyForecastContainer}>
                            <Text style={[styles.forecastTitle, { color: textColor }]}>Próximas Horas</Text>
                            {hourlyForecast.time && (
                                <FlatList
                                    horizontal
                                    data={hourlyForecast.time.slice(0, 24)}
                                    keyExtractor={(item) => item}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => (
                                        <View style={[styles.hourlyForecastItem, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                                            <Text style={[styles.hourlyForecastTime, { color: textColor }]}>{formatHour(item)}</Text>
                                            {hourlyForecast.temperature_2m && (
                                                <Text style={[styles.hourlyForecastTemp, { color: textColor }]}>
                                                    {Math.round(hourlyForecast.temperature_2m?.[index])}°
                                                </Text>
                                            )}
                                            {hourlyForecast.precipitation_probability && (
                                                <Text style={[styles.hourlyForecastRain, { color: textColor }]}>
                                                    {hourlyForecast.precipitation_probability?.[index]}%
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                />
                            )}
                        </View>

                        <View style={styles.forecastContainer}>
                            <Text style={[styles.forecastTitle, { color: textColor }]}>Próximos Dias</Text>
                            {forecast.time && (
                                <FlatList
                                    horizontal
                                    data={forecast.time}
                                    keyExtractor={(item) => item}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => (
                                        <View style={[styles.forecastItem, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                                            <Text style={[styles.forecastDay, { color: textColor }]}>{formatDay(item)}</Text>
                                            {forecast.temperature_2m_max && forecast.temperature_2m_min && (
                                                <Text style={[styles.forecastTemp, { color: textColor }]}>
                                                    {Math.round(forecast.temperature_2m_max?.[index])}°/{Math.round(forecast.temperature_2m_min?.[index])}°
                                                </Text>
                                            )}
                                            {forecast.precipitation_probability_max && (
                                                <Text style={[styles.forecastRain, { color: textColor }]}>{forecast.precipitation_probability_max?.[index]}%</Text>
                                            )}
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={[styles.errorText, { color: textColor }]}>Não foi possível obter os dados do clima.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    backButton: {
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherContainer: {
        alignItems: 'center',
    },
    city: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    temperature: {
        fontSize: 72,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    description: {
        fontSize: 20,
        marginBottom: 20,
    },
    detailsContainer: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailIcon: {
        marginBottom: 5,
    },
    detailText: {
        fontSize: 16,
    },
    hourlyForecastContainer: {
        marginTop: 30,
        width: '100%',
    },
    forecastContainer: {
        marginTop: 30,
        width: '100%',
    },
    forecastTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'left',
    },
    hourlyForecastItem: {
        width: 60,
        padding: 10,
        borderRadius: 10,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hourlyForecastTime: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    hourlyForecastTemp: {
        fontSize: 12,
    },
    hourlyForecastRain: {
        fontSize: 10,
        marginTop: 3,
    },
    forecastItem: {
        width: 80,
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    forecastDay: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    forecastTemp: {
        fontSize: 14,
    },
    forecastRain: {
        fontSize: 12,
        marginTop: 5,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default WeatherScreen;