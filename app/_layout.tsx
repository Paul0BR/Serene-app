import React from 'react';
import { Slot } from 'expo-router';
import { ColorProvider } from '../app/context/ColorContext';

const RootLayout: React.FC = (): JSX.Element => {
  return (
    <ColorProvider>
      <Slot />
    </ColorProvider>
  );
};

export default RootLayout;
