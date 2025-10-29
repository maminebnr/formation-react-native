import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { fetchRegions } from '../api';
import { useAuth } from '../auth/useAuth';

export default function RegionsScreen({ navigation }) {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try { setData(await fetchRegions(token)); }
            catch (e) { console.log(e); }
            finally { setLoading(false); }
        })();
    }, [token]);

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

    const filtered = data.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));

    return (
        <View style={s.container}>
            <TextInput style={s.search} placeholder="Rechercher une région…" value={q} onChangeText={setQ} />
            <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TouchableOpacity style={s.card} onPress={() => navigation.navigate('Areas', { region: item })}>
                        <Text style={s.title}>{item.name}</Text>
                        <Text style={s.meta}>Zones: {item.areas?.length ?? 0}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    search: {
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 10, marginBottom: 12,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2
    },
    card: {
        backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#eee',
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3
    },
    title: { fontSize: 16, fontWeight: '700' },
    meta: { marginTop: 6, color: '#666' }
});
