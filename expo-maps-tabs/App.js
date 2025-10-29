import { Ionicons } from '@expo/vector-icons';


import HomeScreen from './screens/HomeScreen';
import MapNativeScreen from './screens/MapNativeScreen';
import ProfileScreen from './screens/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';  

const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused, size }) => {
            let name = 'home-outline';
            if (route.name === 'Accueil') name = focused ? 'home' : 'home-outline';
            if (route.name === 'Carte') name = focused ? 'map' : 'map-outline';
            if (route.name === 'Profil') name = focused ? 'person' : 'person-outline';
            return <Ionicons name={name} size={size} />;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Carte" component={MapNativeScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
