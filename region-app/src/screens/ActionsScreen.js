import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { fetchRegionById, putRegion } from '../api';
import { useAuth } from '../auth/useAuth';

export default function ActionsScreen() {
    const { token } = useAuth();
    const [regionId, setRegionId] = useState('1');
    const [unitId, setUnitId] = useState('1001'); // unité de test
    const [pillarName, setPillarName] = useState('');
    const [pillarDesc, setPillarDesc] = useState('');
    const [pillarIdEdit, setPillarIdEdit] = useState('');
    const [newName, setNewName] = useState('');
    const [removeId, setRemoveId] = useState('');

    const loadRegion = async () => fetchRegionById(Number(regionId), token);
    const saveRegion = async (region) => putRegion(region, token);

    function findUnit(region, id) {
        for (const area of region.areas || []) {
            for (const unit of area.units || []) {
                if (unit.id === id) return unit;
            }
        }
        return null;
    }

    const addPillar = async () => {
        if (!pillarName) return Alert.alert('Attention', 'Nom du pilier requis.');
        const region = await loadRegion();
        const u = findUnit(region, Number(unitId));
        if (!u) return Alert.alert('Erreur', 'Unité introuvable.');
        const newId = Date.now();
        u.pillars = u.pillars || [];
        u.pillars.push({ id: newId, name: pillarName, description: pillarDesc || '' });
        await saveRegion(region);
        Alert.alert('OK', `Pilier ajouté (${pillarName}).`);
        setPillarName(''); setPillarDesc('');
    };

    const editPillar = async () => {
        const pid = Number(pillarIdEdit);
        if (!pid || !newName) return Alert.alert('Attention', 'ID et nouveau nom requis.');
        const region = await loadRegion();
        const u = findUnit(region, Number(unitId));
        if (!u || !u.pillars) return Alert.alert('Erreur', 'Pas de piliers.');
        const p = u.pillars.find(x => x.id === pid);
        if (!p) return Alert.alert('Erreur', 'Pilier introuvable.');
        p.name = newName;
        await saveRegion(region);
        Alert.alert('OK', 'Nom modifié.');
        setNewName('');
    };

    const deletePillar = async () => {
        const pid = Number(removeId);
        if (!pid) return Alert.alert('Attention', 'ID requis.');
        const region = await loadRegion();
        const u = findUnit(region, Number(unitId));
        if (!u || !u.pillars) return Alert.alert('Erreur', 'Pas de piliers.');
        u.pillars = u.pillars.filter(x => x.id !== pid);
        await saveRegion(region);
        Alert.alert('OK', 'Pilier supprimé.');
        setRemoveId('');
    };

    return (
        <ScrollView contentContainerStyle={s.container}>
            <Text style={s.h1}>Actions sur les Piliers</Text>
            <Text style={s.help}>Travaille sur Region ID (ex: 1) et Unité ID (ex: 1001). Change selon ta data.</Text>

            <View style={s.row}>
                <TextInput style={s.inputSm} value={regionId} onChangeText={setRegionId} placeholder="Region ID" keyboardType="numeric" />
                <TextInput style={s.inputSm} value={unitId} onChangeText={setUnitId} placeholder="Unit ID" keyboardType="numeric" />
            </View>

            <View style={s.card}>
                <Text style={s.h2}>Créer un pilier</Text>
                <TextInput style={s.input} placeholder="Nom du pilier" value={pillarName} onChangeText={setPillarName} />
                <TextInput style={s.input} placeholder="Description (optionnelle)" value={pillarDesc} onChangeText={setPillarDesc} />
                <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={addPillar}>
                    <Text style={s.btnTxt}>Ajouter</Text>
                </TouchableOpacity>
            </View>

            <View style={s.card}>
                <Text style={s.h2}>Modifier le nom d’un pilier</Text>
                <TextInput style={s.input} placeholder="Pillar ID" value={pillarIdEdit} onChangeText={setPillarIdEdit} keyboardType="numeric" />
                <TextInput style={s.input} placeholder="Nouveau nom" value={newName} onChangeText={setNewName} />
                <TouchableOpacity style={[s.btn, s.btnWarn]} onPress={editPillar}>
                    <Text style={s.btnTxt}>Modifier</Text>
                </TouchableOpacity>
            </View>

            <View style={s.card}>
                <Text style={s.h2}>Supprimer un pilier</Text>
                <TextInput style={s.input} placeholder="Pillar ID" value={removeId} onChangeText={setRemoveId} keyboardType="numeric" />
                <TouchableOpacity style={[s.btn, s.btnDanger]} onPress={deletePillar}>
                    <Text style={s.btnTxt}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff' },
    h1: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
    help: { color: '#666', marginBottom: 12 },
    row: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    inputSm: {
        flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2
    },
    card: {
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, marginBottom: 12,
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3
    },
    h2: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
    input: {
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 10, marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2
    },
    btn: { padding: 12, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
    btnPrimary: { backgroundColor: '#1f7ae0' },
    btnWarn: { backgroundColor: '#e0a11f' },
    btnDanger: { backgroundColor: '#d9423a' },
    btnTxt: { color: '#fff', fontWeight: '800' }
});

