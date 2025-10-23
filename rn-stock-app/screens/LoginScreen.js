import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Spacer from '../components/ui/Spacer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
export default function LoginScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Spacer h={16} />
            <Input placeholder=
                "Email" 
                keyboardType=
                "email-address"
                autoCapitalize=
                "none" />
            <Spacer h={12} />
            <Input placeholder=
                "Mot de passe" secureTextEntry />
            <Spacer h={16} />
        <Button onPress={() => navigation.navigate('Products')}>
            Se connecter</Button>
        </View>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1, padding: 24, justifyContent: 'center',
        gap: 8
    },
    title: {
        fontSize: 24, fontWeight: '800',
        textAlign: 'center'
    },
});