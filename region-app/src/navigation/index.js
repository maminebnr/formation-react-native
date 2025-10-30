import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ExplorerScreen from '../screens/ExplorerScreen';
import ItemFormScreen from '../screens/ItemFormScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../auth/useAuth';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explorer" component={ExplorerScreen} options={{ title: 'Explorer' }} />
      <Stack.Screen name="ItemForm" component={ItemFormScreen} options={{ title: 'Formulaire' }} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />
        }}
      />
    </Tabs.Navigator>
  );
}

export default function RootNavigation() {
  const { token } = useAuth();
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
