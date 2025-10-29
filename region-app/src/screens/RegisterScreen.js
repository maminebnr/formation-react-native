import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { apiRegister } from '../api';
import { useAuth } from '../auth/useAuth';

export default function RegisterScreen({ navigation }) {
    const { signIn } = useAuth();
    const [name, setName] = useState('Nouvel utilisateur');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!email || !password || !name) return Alert.alert('Attention', 'Complétez tous les champs.');
        setLoading(true);
        try {
            const data = await apiRegister(name, email, password);
            await signIn(data);
        } catch (e) {
            Alert.alert('Erreur', e.message || 'Inscription échouée.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={s.container}>
            <Text style={s.title}>Créer un compte</Text>
            <TextInput style={s.input} placeholder="Nom" value={name} onChangeText={setName} />
            <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={s.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={[s.btn, loading && { opacity: .6 }]} onPress={onSubmit} disabled={loading}>
                <Text style={s.btnText}>{loading ? 'Création…' : 'S’inscrire'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={s.link}>J’ai déjà un compte</Text>
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
        backgroundColor: '#22a35a', padding: 14, borderRadius: 12, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3
    },
    btnText: { color: '#fff', fontWeight: '700' },
    link: { marginTop: 14, color: '#1f7ae0', textAlign: 'center' }
});
