import { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function PillarsScreen({ route, navigation }) {
    const { unit, pathTitle } = route.params;
    const pillars = Array.isArray(unit?.pillars) ? unit.pillars : [];

    useEffect(() => {
        navigation.setOptions({ title: `Piliers — ${unit?.name ?? ''}` });
    }, [unit]);

    return (
        <View style={s.container}>
            <Text style={s.breadcrumb}>{pathTitle} / {unit?.name}</Text>
            <FlatList
                data={pillars}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={s.card}>
                        <Text style={s.title}>{item.name}</Text>
                        {item.description ? <Text style={s.desc}>{item.description}</Text> : null}
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={<Text>Aucun pilier pour cette unité.</Text>}
            />
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    breadcrumb: { marginBottom: 10, color: '#666' },
    card: {
        backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#eee',
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3
    },
    title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    desc: { fontSize: 14, color: '#444' }
});

