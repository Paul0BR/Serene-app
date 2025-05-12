import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColor } from '../context/ColorContext';

const TabLayout: React.FC = (): JSX.Element => {
  const { colors } = useColor();

  return (
    <Tabs
      screenOptions={({ route }: { route: any }) => ({
        tabBarIcon: ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName: string = '';

          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'explore') {
            iconName = focused ? 'grid' : 'grid-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors[0],
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          width: 140,
          height: 45,
          flexDirection: 'row',
          alignSelf: 'center',
          marginBottom: 20,
          backgroundColor: colors[1],
          borderTopWidth: 0,
          borderRadius: 15,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="home" options={{ title: '' }} />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          // Esta opção garante que as sub-rotas funcionem corretamente:
          href: '/explore',
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
