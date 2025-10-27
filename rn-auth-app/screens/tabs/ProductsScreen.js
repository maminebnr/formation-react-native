import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Modal, StyleSheet, Pressable } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ProductsApi } from '../../lib/api';
import { useAuth } from '../auth/AuthContext';
function ProductsScreen() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [edit, setEdit] = useState(null);
  const [openDel, setOpenDelete] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const { user } = useAuth();

  useEffect(() => { load(); }, []);
  const load = async () => {
    const data = await ProductsApi.list();
    setItems(data.filter(p => p.userId === user.id));
  }

  const openCreate = () => {
    setEdit(null); setName(''); setSku('');
    setStock(''); setOpen(true);
  };
  const openEdit = (p) => {
    setEdit(p); setName(p.name);
    setSku(p.sku); setStock(String(p.stock)); setOpen(true);
  };
  const openDelete = (p) => {
    setSelectId(p.id);
    console.log("p", selectId)
    setOpenDelete(true);
  };
  const save = async () => {
    const d = { name, sku, stock: Number(stock || 0), userId: user.id };
    console.log(d)
    if (edit) await ProductsApi.update(edit.id, d);
    else await ProductsApi.create(d);
    setOpen(false); load();
  };
  const remove = async () => { console.log("hello", selectId);
     await ProductsApi.remove(selectId); 
     setOpenDelete(false);
     setSelectId(null);
    load(); };
  return (
    <View style={s.c}>
      <View style={s.h}>
        <Text style={s.t}>Produits</Text>
        <Button onPress={openCreate}>Ajouter</Button>
      </View>
      <FlatList
        data={items}
        keyExtractor={it => String(it.id)}
        renderItem={({ item }) => (
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.meta}>SKU : {item.sku} - Stock :

                {item.stock}</Text>
            </View>
            <Pressable onPress={() => openEdit(item)}><Text

              style={s.link}>Modifier</Text></Pressable>

            <Pressable onPress={() => openDelete(item)}><Text

              style={s.link}>Supprimer</Text></Pressable>

          </View>
        )}
      />
      <Modal visible={open} transparent animationType="slide">
        <View style={s.modalWrap}>
          <View style={s.modal}>
            <Text style={s.mt}>{edit ? 'Modifier le produit' : 'Nouveau produit'}</Text>

            <Input placeholder="Nom" value={name} onChangeText={setName} />

            <Input placeholder="SKU" value={sku} onChangeText={setSku} />

            <Input placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="number-pad" />

            <Button onPress={save}>Enregistrer</Button>

            <Button style={{ backgroundColor: '#999' }} onPress={() => setOpen(false)}>Annuler</Button>

          </View>
        </View>
      </Modal>
      <Modal visible={openDel} transparent animationType="slide">
        <View style={s.modalWrap}>
          <View style={s.modal}>
            <Text style={s.mt}>confirmer cette suppression ?</Text>
            <Button onPress={remove} style={{ backgroundColor: 'red' }}>Oui</Button>
            <Button style={{ backgroundColor: '#999' }} onPress={() => setOpenDelete(false)}>Non</Button>

          </View>
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 16 },
  h: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 12
  },
  t: { fontSize: 22, fontWeight: '800' },
  row: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1,
    borderColor: '#ddd'
  },
  name: { fontWeight: '700', fontSize: 16 },
  meta: { color: '#666' },
  link: { marginLeft: 10, color: '#2563eb' },
  modalWrap: {
    flex: 1, justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', padding: 16
  },
  modal: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  mt: { fontWeight: '800', fontSize: 18, marginBottom: 10 },
});

export default ProductsScreen
