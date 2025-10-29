import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../auth/useAuth';

export default function ProfileScreen() {
    const { me, signOut } = useAuth();
    return (
        <View style={s.container}>
            <Text style={s.title}>Mon Profil</Text>
            <Text style={s.label}>Nom : <Text style={s.value}>{me?.name}</Text></Text>
            <Text style={s.label}>Email : <Text style={s.value}>{me?.email}</Text></Text>
            <TouchableOpacity style={s.btn} onPress={signOut}>
                <Text style={s.btnTxt}>Se déconnecter</Text>
            </TouchableOpacity>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
    label: { fontSize: 16, marginBottom: 6 },
    value: { fontWeight: '700' },
    btn: { marginTop: 16, backgroundColor: '#333', padding: 12, borderRadius: 10, alignItems: 'center' },
    btnTxt: { color: '#fff', fontWeight: '800' }
});

