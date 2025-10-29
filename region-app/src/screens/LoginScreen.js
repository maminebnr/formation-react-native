import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { apiLogin } from '../api';
import { useAuth } from '../auth/useAuth';

export default function LoginScreen({ navigation }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('admin@test.com');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!email || !password) return Alert.alert('Attention', 'Email et mot de passe requis.');
        setLoading(true);
        try {
            const data = await apiLogin(email, password);
            await signIn(data);
        } catch (e) {
            Alert.alert('Erreur', e.message || 'Connexion échouée.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={s.container}>
            <Text style={s.title}>Bienvenue 👋</Text>
            <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={s.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={[s.btn, loading && { opacity: .6 }]} onPress={onSubmit} disabled={loading}>
                <Text style={s.btnText}>{loading ? 'Connexion…' : 'Se connecter'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={s.link}>Nouveau ? Créer un compte</Text>
            </TouchableOpacity>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
    input: {
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 10, marginBottom: 12,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2
    },
    btn: {
        backgroundColor: '#1f7ae0', padding: 14, borderRadius: 12, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3
    },
    btnText: { color: '#fff', fontWeight: '700' },
    link: { marginTop: 14, color: '#1f7ae0', textAlign: 'center' }
});
