import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import ListScreen from './screens/ListScreen';
import PostsListScreen from './screens/PostListScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import PostCreateScreen from './screens/PostCreateScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
         <Stack.Screen 
          name="Products" 
          component={PostsListScreen} 
        />
           <Stack.Screen 
          name="PostDetail" 
          component={PostDetailScreen} 
        />
       <Stack.Screen 
          name="PostCreate" 
          component={PostCreateScreen} 
        />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}