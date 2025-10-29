import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegionsScreen from '../screens/RegionsScreen';
import AreasScreen from '../screens/AreasScreen';
import UnitsScreen from '../screens/UnitsScreen';
import PillarsScreen from '../screens/PillarsScreen';
import ActionsScreen from '../screens/ActionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../auth/useAuth';
import { Text } from 'react-native';
import ProfileWithHeader from '../screens/ProfileWithHeader';
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Regions" component={RegionsScreen} options={{ title: 'Régions' }} />
      <Stack.Screen name="Areas" component={AreasScreen} options={{ title: 'Zones' }} />
      <Stack.Screen name="Units" component={UnitsScreen} options={{ title: 'Unités' }} />
      <Stack.Screen name="Pillars" component={PillarsScreen} options={{ title: 'Piliers' }} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="HomeTab" component={HomeStack} options={{ title: 'Accueil' }} />
      <Tabs.Screen name="Actions" component={ActionsScreen} options={{ title: 'Actions' }} />
      <Tabs.Screen name="Profile" component={ProfileWithHeader} options={{ title: 'Profil' }} />
    </Tabs.Navigator>
  );
}

export default function RootNavigation() {
  const { token, loading } = useAuth();
  if (loading) return <Text style={{ marginTop: 50, textAlign: 'center' }}>Chargement…</Text>;

  return (
    <NavigationContainer>
      {token ? (
        <AppTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Créer un compte' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
