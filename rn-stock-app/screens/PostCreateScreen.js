import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spacer from '../components/ui/Spacer';
import { createPost } from './lib/jsonPlaceholder';

export default function PostCreateScreen({ navigation, route }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const onCreated = route?.params?.onCreated;

    const onSubmit = async () => {
        if ((title || '').length < 3) {
            return Alert.alert('Validation', 'Titre trop court');
        }
        if ((body || '').length < 5) {
            return Alert.alert('Validation', 'Contenu trop court');
        }

        const payload = { title, body, userId: 1 };
        setLoading(true);
        
        try {
            const result = await createPost(payload);
            // insertion optimiste dans la liste appelante
            onCreated && onCreated({
                ...payload,
                id: result.id || Math.floor(Math.random() * 1_000_000)
            });
            navigation.goBack();
        } catch (e) {
            Alert.alert('Erreur', String(e.message || e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nouvel article</Text>
            <Spacer h={12} />
            
            <Input 
                placeholder="Titre" 
                value={title}
                onChangeText={setTitle} 
            />
            <Spacer h={12} />
            
            <Input 
                placeholder="Contenu" 
                value={body}
                onChangeText={setBody} 
                multiline 
            />
            <Spacer h={16} />
            
            <Button 
                onPress={onSubmit} 
                style={{ opacity: loading ? 0.6 : 1 }}
            >
                {loading ? 'Publication...' : 'Publier (optimiste)'}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16 
    },
    title: { 
        fontSize: 22, 
        fontWeight: '800' 
    }
});