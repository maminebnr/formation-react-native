import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable,
RefreshControl, Alert } from 'react-native';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spacer from '../components/ui/Spacer';
import { fetchPosts } from './lib/jsonPlaceholder';
export default function PostsListScreen({ navigation }) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);

    const load = useCallback(async (reset = false) => {
        if (loading) return;
        setLoading(true);
        
        try {
            const nextPage = reset ? 1 : page;
            const data = await fetchPosts({ page: nextPage, limit: 10, q });
            const newList = reset ? data : [...items, ...data];
            
            setItems(newList);
            setHasMore(data.length === 10);
            setPage(nextPage + 1);
        } catch (e) {
            Alert.alert('Erreur', String(e.message || e));
        } finally {
            setLoading(false);
        }
    }, [loading, page, q, items]);

    useEffect(() => {
        load(true);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Articles (Placeholder API)</Text>
            <Spacer h={8} />
            
            <Input 
                placeholder="Recherche (titre/texte)" 
                value={q}
                onChangeText={setQ} 
            />
            <Spacer h={8} />
            
            <Button onPress={() => load(true)}>
                Rechercher
            </Button>
            <Spacer h={8} />
            
            <Button
                style={{ backgroundColor: '#10b981' }}
                onPress={() => navigation.navigate('PostCreate', {
                    onCreated: (p) => setItems([p, ...items])
                })}
            >
                + Nouvel article (optimiste)
            </Button>
            <Spacer h={8} />
            
            <FlatList
                data={items}
                keyExtractor={(i) => String(i.id)}
                refreshControl={
                    <RefreshControl 
                        refreshing={loading}
                        onRefresh={() => load(true)} 
                    />
                }
                onEndReachedThreshold={0.4}
                onEndReached={() => {
                    if (hasMore && !loading) load(false);
                }}
                renderItem={({ item }) => (
                    <Card style={{ marginBottom: 12 }}>
                        <Pressable 
                            onPress={() => navigation.navigate('PostDetail', { id: item.id })}
                        >
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemMeta} numberOfLines={2}>
                                {item.body}
                            </Text>
                        </Pressable>
                    </Card>
                )}
                ListFooterComponent={
                    <Text style={styles.footer}>
                        {hasMore ? 'Charger plus…' : 'Fin de liste'}
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16, 
        backgroundColor: '#fff' 
    },
    title: { 
        fontSize: 22, 
        fontWeight: '800', 
        color: '#111827' 
    },
    itemTitle: { 
        fontSize: 16, 
        fontWeight: '700', 
        marginBottom: 4 
    },
    itemMeta: { 
        color: '#6b7280' 
    },
    footer: { 
        textAlign: 'center', 
        color: '#9ca3af', 
        paddingVertical: 13 
    },
});