import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ToastProvider } from './components/toast/ToastProvider';
import { AuthProvider, useAuth } from './screens/auth/AuthContext';
import LoginScreen from './screens/auth/LoginScrenn';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/tabs/HomeScreen';
import ProductsScreen from './screens/tabs/ProductsScreen';
import ProfileWithHeader from './screens/tabs/ProfileWithHeader';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from './screens/tabs/DashboardScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          const icons = {
            Dashboard :focused ?'stats-chart' : 'stats-chart-outline',
            Home: focused ? 'home' : 'home-outline',
            Products: focused ? 'pricetags' : 'pricetags-outline',
            Profile: focused ? 'person' : 'person-outline'
            ,
          };
          return <Ionicons name={icons[route.name]} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerTitle:'Dashboard',headerShown:true}} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerTitle:'home',headerShown:true}} />
      <Tab.Screen name="Products" component={ProductsScreen} options={{ title: 'Produits',headerShown:true }} />
      <Tab.Screen name="Profile" component={ProfileWithHeader} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

function Root() {
  const { token, init } = useAuth();

  if (init) return null;

  return token ? <AppTabs /> : <PublicStack />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </AuthProvider>
    </ToastProvider>
  );
}