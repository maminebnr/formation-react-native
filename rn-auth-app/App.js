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
import ProfileScreen from './screens/tabs/ProfileScreen';

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
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Accueil' }} 
      />
      <Tab.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{ title: 'Produits' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil' }} 
      />
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