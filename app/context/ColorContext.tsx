import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
  } from 'react';
  
  type ColorPair = [string, string];
  
  interface ColorContextType {
    colors: ColorPair;
    setColors: Dispatch<SetStateAction<ColorPair>>;
    colorPairs: ColorPair[];
  }
  
  const colorPairs: ColorPair[] = [
    ['#FED901', '#FD8101'],
    ['#EB5402', '#CC1A02'],
    ['#CD0615', '#770430'],
    ['#04E6FF', '#0B818E'],
    ['#9A07FB', '#080481'],
    ['#D2D2D2', '#4F4F4F'],
  ];
  
  const ColorContext = createContext<ColorContextType | undefined>(undefined);
  
  export const useColor = (): ColorContextType => {
    const context = useContext(ColorContext);
    if (!context) {
      throw new Error('useColor must be used within a ColorProvider');
    }
    return context;
  };
  
  interface ColorProviderProps {
    children: ReactNode;
  }
  
  export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
    const [colors, setColors] = useState<ColorPair>(colorPairs[0]);
  
    return (
      <ColorContext.Provider value={{ colors, setColors, colorPairs }}>
        {children}
      </ColorContext.Provider>
    );
  };
  
  export default ColorProvider;
  