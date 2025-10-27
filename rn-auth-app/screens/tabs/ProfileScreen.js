import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../auth/AuthContext';
import { UsersApi } from '../../lib/api';
export default function ProfileScreen() {
  const { user,signOut } = useAuth();
  const [name, setName] = useState(user?.name || '');

  const save = async () => {
    await UsersApi.update(user.id, {
      name
    });
  };
  return (
    <View style={s.c}>
      <Text style={s.t}>Profil</Text>
      <Text style={s.l}>Nom</Text>
      <Input value={name} onChangeText={setName} />
      <Text style={s.l}>Email</Text>
      <Input value={user?.email} editable={false} />
      <Button onPress={save}>Enregistrer</Button>
     <Button style={{ backgroundColor: '#ff0000ff' }} onPress={signOut}>logout</Button>
      <Text style={s.info}>Déconnexion dans l'en-tête</Text>
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, padding: 16 },
  t: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  l: { fontWeight: '700', marginTop: 10, marginBottom: 4 },
  info: { marginTop: 12, color: '#666' }
});