import { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function UnitsScreen({ route, navigation }) {
  const { area, regionName } = route.params;
  const units = Array.isArray(area?.units) ? area.units : [];

  useEffect(() => {
    navigation.setOptions({ title: `Unités — ${area?.name ?? ''}` });
  }, [area]);

  return (
    <View style={s.container}>
      <FlatList
        data={units}
        keyExtractor={(item)=> String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card}
            onPress={() => navigation.navigate('Pillars', { unit: item, pathTitle: `${regionName} / ${area?.name}` })}>
            <Text style={s.title}>{item.name}</Text>
            <Text style={s.meta}>Piliers: {item.pillars?.length ?? 0}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<Text>Aucune unité pour cette zone.</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:{ flex:1, padding:16, backgroundColor:'#fff' },
  card:{ backgroundColor:'#fff', padding:14, borderRadius:12, borderWidth:1, borderColor:'#eee',
         shadowColor:'#000', shadowOpacity:0.08, shadowRadius:10, elevation:3 },
  title:{ fontSize:16, fontWeight:'700' },
  meta:{ marginTop:6, color:'#666' }
});
