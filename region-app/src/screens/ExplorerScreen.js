import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    LayoutAnimation,
    UIManager,
    Platform,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchRegions, fetchRegionById, putRegion } from '../api';
import { useAuth } from '../auth/useAuth';


// Helpers
const makeKey = (path) => path.join('/');
const toTree = (regions) =>
    (regions || []).map((r) => ({
        key: makeKey(['region', r.id]),
        level: 'region',
        id: r.id,
        name: r.name,
        children: (r.secteurs || []).map((s) => ({
            key: makeKey(['region', r.id, 'secteur', s.id]),
            level: 'secteur',
            id: s.id,
            name: s.name,
            children: (s.patrouille || []).map((p) => ({
                key: makeKey(['region', r.id, 'secteur', s.id, 'patrouille', p.id]),
                level: 'patrouille',
                id: p.id,
                name: p.name,
                children: (p.postes || []).map((pos) => ({
                    key: makeKey(['region', r.id, 'secteur', s.id, 'patrouille', p.id, 'poste', pos.id]),
                    level: 'poste',
                    id: pos.id,
                    name: pos.name,
                    description: pos.description || '',
                    path: { regionId: r.id, secteurId: s.id, patrouilleId: p.id, posteId: pos.id },
                })),
            })),
        })),
    }));

const deepFilter = (nodes, term) => {
    if (!term) return nodes;
    const q = term.toLowerCase();
    const matches = (n) =>
        (n.name || '').toLowerCase().includes(q) ||
        (n.description || '').toLowerCase().includes(q) ||
        String(n.id).toLowerCase().includes(q) ||
        (n.level || '').toLowerCase().includes(q);

    const rec = (list) =>
        list.reduce((acc, n) => {
            const kids = n.children?.length ? rec(n.children) : [];
            if (matches(n) || kids.length) acc.push({ ...n, children: kids });
            return acc;
        }, []);
    return rec(nodes);
};

// Row Component
function Row({ node, level, onOpenForm, onAdd, onRename, onRemove }) {
    const [open, setOpen] = useState(false);
    const hasChildren = node.children?.length > 0;

    return (
        <View style={[s.card, { marginLeft: level * 12 }]}>
            <View style={s.row}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={
                        hasChildren
                            ? () => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setOpen(!open);
                            }
                            : () => onOpenForm(node)
                    }
                >
                    <Text style={s.title}>
                        {node.name} <Text style={s.level}>({node.level})</Text>
                    </Text>
                    {!!node.description && <Text style={s.desc}>{node.description}</Text>}
                </TouchableOpacity>

                {node.level === 'patrouille' && (
                    <TouchableOpacity style={s.iconBtn} onPress={() => onAdd(node)}>
                        <Ionicons name="add-circle-outline" size={20} color="#22a35a" />
                    </TouchableOpacity>
                )}

                {node.level === 'poste' ? (
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity style={s.iconBtn} onPress={() => onRename(node)}>
                            <MaterialCommunityIcons name="pencil-outline" size={20} color="#1f7ae0" />
                        </TouchableOpacity>
                        <TouchableOpacity style={s.iconBtn} onPress={() => onRemove(node)}>
                            <Ionicons name="trash-outline" size={20} color="#d9534f" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Ionicons
                        name={hasChildren ? (open ? 'chevron-down' : 'chevron-forward') : 'ellipse-outline'}
                        size={18}
                        color="#777"
                    />
                )}
            </View>

            {hasChildren && open && (
                <View style={{ marginTop: 6 }}>
                    {node.children.map((child) => (
                        <Row
                            key={child.key}
                            node={child}
                            level={level + 1}
                            onOpenForm={onOpenForm}
                            onAdd={onAdd}
                            onRename={onRename}
                            onRemove={onRemove}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

// Main Component
export default function ExplorerScreen({ navigation }) {
    const { token } = useAuth();
    const [regions, setRegions] = useState(null);
    const [tree, setTree] = useState([]);
    const [q, setQ] = useState('');
    const [addModal, setAddModal] = useState({ visible: false, patrouilleNode: null, name: '', desc: '' });
    const [renameModal, setRenameModal] = useState({ visible: false, posteNode: null, name: '' });

    useEffect(() => {
        (async () => {
            try {
                const list = await fetchRegions(token);
                setRegions(list);
                setTree(toTree(list));
            } catch (e) {
                console.log(e);
            }
        })();
    }, [token]);

    const filtered = useMemo(() => deepFilter(tree, q), [tree, q]);

    async function refreshRegion(regionId) {
        const updated = await fetchRegionById(regionId, token);
        const nextRegions = (regions || []).map((r) => (r.id === regionId ? updated : r));
        setRegions(nextRegions);
        setTree(toTree(nextRegions));
    }

    async function persistRegion(mutator, regionId) {
        const region = await fetchRegionById(regionId, token);
        mutator(region);
        await putRegion(region, token);
        await refreshRegion(regionId);
    }

    const onAdd = (patrouilleNode) => {
        setAddModal({ visible: true, patrouilleNode, name: '', desc: '' });
    };

    const confirmAdd = async () => {
        const { patrouilleNode, name, desc } = addModal;
        if (!name.trim()) return Alert.alert('Attention', 'Nom requis');

        await persistRegion((region) => {
            const secteur = region.secteurs.find((s) => s.id === patrouilleNode.path.secteurId);
            const patrouille = secteur.patrouille.find((p) => p.id === patrouilleNode.path.patrouilleId);
            patrouille.postes = patrouille.postes || [];
            patrouille.postes.push({ id: Date.now(), name, description: desc || '' });
        }, patrouilleNode.path.regionId);

        setAddModal({ visible: false, patrouilleNode: null, name: '', desc: '' });
    };

    const onRename = (posteNode) => {
        setRenameModal({ visible: true, posteNode, name: posteNode.name });
    };

    const confirmRename = async () => {
        const { posteNode, name } = renameModal;
        if (!name.trim()) return Alert.alert('Attention', 'Nom requis');

        await persistRegion((region) => {
            const secteur = region.secteurs.find((s) => s.id === posteNode.path.secteurId);
            const patrouille = secteur.patrouille.find((p) => p.id === posteNode.path.patrouilleId);
            const pos = patrouille.postes.find((x) => x.id === posteNode.id);
            if (pos) pos.name = name;
        }, posteNode.path.regionId);

        setRenameModal({ visible: false, posteNode: null, name: '' });
    };

    const onRemove = (posteNode) => {
        Alert.alert('Confirmer', `Supprimer « ${posteNode.name} » ?`, [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                style: 'destructive',
                onPress: async () => {
                    await persistRegion((region) => {
                        const secteur = region.secteurs.find((s) => s.id === posteNode.path.secteurId);
                        const patrouille = secteur.patrouille.find((p) => p.id === posteNode.path.patrouilleId);
                        patrouille.postes = (patrouille.postes || []).filter((x) => x.id !== posteNode.id);
                    }, posteNode.path.regionId);
                },
            },
        ]);
    };

    const onOpenForm = (node) => navigation.navigate('ItemForm', { node });

    if (!regions) return <ActivityIndicator style={{ marginTop: 40 }} />;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={s.searchWrap}>
                <Ionicons name="search-outline" size={18} color="#666" />
                <TextInput
                    placeholder="Rechercher..."
                    value={q}
                    onChangeText={setQ}
                    style={s.search}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <Row
                        node={item}
                        level={0}
                        onOpenForm={onOpenForm}
                        onAdd={onAdd}
                        onRename={onRename}
                        onRemove={onRemove}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ padding: 12 }}
            />

            {/* Add Modal */}
            <Modal
                visible={addModal.visible}
                transparent
                animationType="fade"
                onRequestClose={() => setAddModal((v) => ({ ...v, visible: false }))}
            >
                <View style={s.modalWrap}>
                    <View style={s.modalCard}>
                        <Text style={s.modalTitle}>Ajouter un poste</Text>
                        <TextInput
                            placeholder="Nom"
                            style={s.input}
                            value={addModal.name}
                            onChangeText={(t) => setAddModal((v) => ({ ...v, name: t }))}
                        />
                        <TextInput
                            placeholder="Description (optionnel)"
                            style={s.input}
                            value={addModal.desc}
                            onChangeText={(t) => setAddModal((v) => ({ ...v, desc: t }))}
                        />
                        <View style={s.modalBtns}>
                            <TouchableOpacity
                                style={[s.btn, { backgroundColor: '#bbb' }]}
                                onPress={() =>
                                    setAddModal({ visible: false, patrouilleNode: null, name: '', desc: '' })
                                }
                            >
                                <Text style={s.btnTxt}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.btn, { backgroundColor: '#22a35a' }]} onPress={confirmAdd}>
                                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                                <Text style={s.btnTxt}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Rename Modal */}
            <Modal
                visible={renameModal.visible}
                transparent
                animationType="fade"
                onRequestClose={() => setRenameModal((v) => ({ ...v, visible: false }))}
            >
                <View style={s.modalWrap}>
                    <View style={s.modalCard}>
                        <Text style={s.modalTitle}>Renommer le poste</Text>
                        <TextInput
                            placeholder="Nouveau nom"
                            style={s.input}
                            value={renameModal.name}
                            onChangeText={(t) => setRenameModal((v) => ({ ...v, name: t }))}
                        />
                        <View style={s.modalBtns}>
                            <TouchableOpacity
                                style={[s.btn, { backgroundColor: '#bbb' }]}
                                onPress={() => setRenameModal({ visible: false, posteNode: null, name: '' })}
                            >
                                <Text style={s.btnTxt}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.btn, { backgroundColor: '#1f7ae0' }]} onPress={confirmRename}>
                                <MaterialCommunityIcons name="content-save-outline" size={18} color="#fff" />
                                <Text style={s.btnTxt}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const s = StyleSheet.create({
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        paddingHorizontal: 10,
        margin: 12,
    },
    search: { flex: 1, paddingVertical: 8 },
    card: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
    row: { flexDirection: 'row', alignItems: 'center' },
    title: { fontWeight: '700', fontSize: 15 },
    level: { color: '#777', fontWeight: '400', fontSize: 13 },
    desc: { color: '#555', marginTop: 4 },
    iconBtn: { padding: 6 },
    modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 18 },
    modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#eee' },
    modalTitle: { fontWeight: '800', fontSize: 16, marginBottom: 8 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 10, marginBottom: 10 },
    modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
    btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
    btnTxt: { color: '#fff', fontWeight: '800' },
});
