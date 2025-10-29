import { useAuth } from "../auth/useAuth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./ProfileScreen";
import { Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';  
const Stack = createNativeStackNavigator();

export default function ProfileWithHeader() {
  const { signOut } = useAuth();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          headerRight: () => (
            <Pressable onPress={signOut} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="log-out-outline" size={22} />
            </Pressable>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

