// App.tsx
import CameraScreen from './src/CameraScreen';
import ImageDetails from './src/ImageDetails';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GalleryComponent from './src/GalleryScreen';


const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="ImageDetails" component={ImageDetails} />
        <Stack.Screen name="GalleryScreen" component={GalleryComponent} />
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default App;
