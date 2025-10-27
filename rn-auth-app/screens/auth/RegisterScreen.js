import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spacer from '../../components/ui/Spacer';
import { isEmail, minLen } from '../../lib/validators';
import { useToast } from '../../components/toast/ToastProvider';
import { useAuth } from './AuthContext';
export default function RegisterScreen({ navigation }) {
    const { signUp } = useAuth();
    const toast = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const errors = useMemo(() => ({
        name: name && !minLen(name, 2) ? 'Nom trop court' : '',
        email: email && !isEmail(email) ? 'Email invalide' : '',
        password: password && !minLen(password, 6) ? 'Mot de passe trop court' : '',
    }), [name, email, password]);
    const valid = isEmail(email) && minLen(password, 6) &&
        minLen(name, 2);
    const submit = async () => {
        try {
            await signUp({ name, email, password });
            toast.show('Compte créé');
        } catch {
            toast.show("Erreur lors de l'inscription");
        }
    };

    return (
        <View style={s.c}>
            <Text style={s.t}>Créer un compte</Text>
            <Spacer h={16} />
            <Input placeholder="Nom complet" value={name}
                onChangeText={setName} />
            {errors.name ? <Text style={s.e}>{errors.name}</Text> : null}
            <Spacer h={8} />
            <Input placeholder="Email" value={email}
                onChangeText={setEmail} keyboardType="email-address" />
            {errors.email ? <Text style={s.e}>{errors.email}</Text> :
                null}
            <Spacer h={8} />
            <Input placeholder="Mot de passe" secureTextEntry
                value={password} onChangeText={setPassword} />
            {errors.password ? <Text style={s.e}>{errors.password}</Text>
                : null}
            <Spacer h={16} />
            <Button disabled={!valid} onPress={submit}>S'inscrire</Button>
            <Spacer h={12} />
            <Button style={{ backgroundColor: '#6b7280' }} onPress={() =>
                navigation.replace('Login')}>Déjà un compte ?</Button>
        </View>
    );
}
const s = StyleSheet.create({
    c: { flex: 1, padding: 24, justifyContent: 'center' },
    t: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
    e: { color: '#ef4444', marginTop: 4 },
});