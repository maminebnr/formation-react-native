import { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function AreasScreen({ route, navigation }) {
    const { region } = route.params;
    const areas = Array.isArray(region?.areas) ? region.areas : [];

    useEffect(() => {
        navigation.setOptions({ title: `Zones — ${region?.name ?? ''}` });
    }, [region]);

    return (
        <View style={s.container}>
            <FlatList
                data={areas}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TouchableOpacity style={s.card}
                        onPress={() => navigation.navigate('Units', { area: item, regionName: region?.name })}>
                        <Text style={s.title}>{item.name}</Text>
                        <Text style={s.meta}>Unités: {item.units?.length ?? 0}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={<Text>Aucune zone pour cette région.</Text>}
            />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    card: {
        backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#eee',
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3
    },
    title: { fontSize: 16, fontWeight: '700' },
    meta: { marginTop: 6, color: '#666' }
});
