import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import Card from '../components/ui/Card';
import Spacer from '../components/ui/Spacer';
import { fetchPost, fetchComments } from './lib/jsonPlaceholder';

export default function PostDetailScreen({ route }) {
    const { id } = route.params;
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const p = await fetchPost(id);
                const c = await fetchComments(id);
                setPost(p);
                setComments(c);
            } catch (e) {
                Alert.alert('Erreur', String(e.message || e));
            }
        })();
    }, [id]);

    if (!post) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{post.title}</Text>
            <Spacer h={8} />
            <Text style={styles.body}>{post.body}</Text>
            <Spacer h={16} />
            <Text style={styles.h2}>Commentaires</Text>
            <FlatList
                data={comments}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                    <Card style={{ marginVertical: 6, backgroundColor:item.name.length >30 ? '#d1fae5' : '#f3f4f6',
 }}>
                        <Text style={styles.commentName}>{item.name}</Text>
                        <Text style={styles.commentBody}>{item.body}</Text>
                    </Card>
                )}
            />
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
        fontWeight: '800', 
        color: '#111827' 
    },
    body: { 
        fontSize: 16, 
        color: '#374151' 
    },
    h2: { 
        fontSize: 18, 
        fontWeight: '700', 
        marginTop: 8, 
        marginBottom: 4 
    },
    commentName: { 
        fontWeight: '700' 
    },
    commentBody: { 
        color: '#4b5563' 
    },
});