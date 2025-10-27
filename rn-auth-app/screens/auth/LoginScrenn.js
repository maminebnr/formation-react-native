import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spacer from '../../components/ui/Spacer';
import { useAuth } from './AuthContext';
import { isEmail, minLen } from '../../lib/validators';
import { useToast } from '../../components/toast/ToastProvider';
export default function LoginScreen({ navigation }) {
    const { signIn } = useAuth();
    const toast = useToast();
    const [email, setEmail] = useState(''); 
    const [password, setPassword] =useState('');
    const [loading, setLoading] = useState(false);
    const errors = useMemo(() => ({
        email: email && !isEmail(email) ? 'Email invalide' : '',
        password: password && !minLen(password, 6) ? '≥ 6 caractères' :'',
    }), [email, password]);
    const disabled = !isEmail(email) || !minLen(password, 6) ||
        loading;
    const submit = async () => {
        try {
            setLoading(true); 
            await signIn(email, password);
            toast.show('Connecté !');
        }
        catch { toast.show('Échec de connexion'); }
        finally { setLoading(false); }
    };
    return (
        <View style={s.c}>
            <Text style={s.t}>Connexion</Text>
            <Spacer h={16} />
            <Input placeholder=
                "Email" value={email}
                onChangeText={setEmail} keyboardType=
                "email-address" />
            {errors.email ? <Text style={s.e}>{errors.email}</Text> :
                null}
            <Spacer h={8} />
            <Input placeholder=
                "Mot de passe" secureTextEntry
                value={password} onChangeText={setPassword} />
            {errors.password ? <Text style={s.e}>{errors.password}</Text>
                : null}
            <Spacer h={16} />
            <Button onPress={submit} disabled={disabled}>{loading ? '' : 'Se connecter'}</Button>
            <Spacer h={12} />
            <Button style={{ backgroundColor: '#6b7280' }} onPress={() =>
                navigation.navigate('Register')}>
                Créer un compte
            </Button>
        </View>
    );
}
const s = StyleSheet.create({
    c: {
        flex: 1, padding: 24,
        justifyContent: 'center'
    }, t: {
        fontSize: 24, fontWeight: '800',
        textAlign: 'center'
    }, e: {
        color: '#ef4444'
        , marginTop: 4
    }
});


