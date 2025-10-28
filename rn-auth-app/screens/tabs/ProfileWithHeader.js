import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import ProfileScreen from './ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function ProfileWithHeader() {
    const { signOut } = useAuth();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name=
                "ProfileScreen"
                component={ProfileScreen}
                options={{
                    title: 'Profil'
                    ,
                    headerRight: () => (
                        <Pressable onPress={signOut} style={{
                            paddingHorizontal:
                                8
                        }}>
                            <Ionicons name=
                                "log-out-outline" size={22} />
                        </Pressable>
                    ),
                }}
            />
        </Stack.Navigator>
    );
}