import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from
  'react-native';
import { useAuth } from '../auth/AuthContext';
import { ProductsApi } from '../../lib/api';
export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => { load(); }, []);
  const load = async () => setProducts(await ProductsApi.list());
  const filtered = products.filter(p => (p.name ||
    '').toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={s.c}>
      <Text style={s.h}>Accueil</Text>
      <Text style={s.sub}>Utilisateur connecté : {user?.name}</Text>
      <TextInput
        style={s.in}
        placeholder=
        "Rechercher un produit"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered.slice(0, 10)}
        keyExtractor={it => String(it.id)}
        renderItem={({ item }) => (
          <Text style={s.item} onPress={() =>
            navigation.navigate('Products')}>
            {item.name} - Stock : {item.stock}
          </Text>
        )}
      />
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 16 },
  h: {
    fontSize: 22, fontWeight: '800'
    , marginBottom: 8
  },
  sub: {
    color: '#6b7280'
    , marginBottom: 12
  },
  in: {
    borderWidth: 1, borderColor: '#ccc'
    , padding: 10,
    borderRadius: 8, marginBottom: 12
  },
  item: {
    paddingVertical: 10, borderBottomWidth: 1, borderColor:
      '#ddd'
  },
});