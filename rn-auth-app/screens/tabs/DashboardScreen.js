import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { ProductsApi } from '../../lib/api';

function Carte({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function LigneBar({ label, value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.barValue}>{value}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);

  const charger = async () => {
    try {
      setChargement(true);
      const data = await ProductsApi.list();
      setProduits(Array.isArray(data) ? data : []);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const kpis = useMemo(() => {
    const totalProduits = produits.length;
    const totalStock = produits.reduce((s, p) => s + Number(p.stock || 0), 0);
    const seuil = 5;
    const nbFaibleStock = produits.filter(p => Number(p.stock || 0) < seuil).length;
    
    return { totalProduits, totalStock, nbFaibleStock, seuil };
  }, [produits]);

  // Top produits par stock (max 5)
  const topStock = useMemo(() => {
    const tri = [...produits].sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
    return tri.slice(0, 5);
  }, [produits]);

  const maxStock = useMemo(() => 
    topStock.reduce((m, p) => Math.max(m, Number(p.stock || 0)), 0), 
    [topStock]
  );

  // Stock faible (stock < seuil)
  const faibles = useMemo(() => 
    produits.filter(p => Number(p.stock || 0) < kpis.seuil), 
    [produits, kpis.seuil]
  );

  // Activité récente : si createdAt existe, trier par createdAt desc, sinon fallback sur id desc
  const recents = useMemo(() => {
    const hasCreatedAt = produits.some(p => p.createdAt);
    const tri = [...produits].sort((a, b) => {
      if (hasCreatedAt) return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return Number(b.id || 0) - Number(a.id || 0);
    });
    return tri.slice(0, 5);
  }, [produits]);

  return (
    <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.container} onreloa>
      <Text style={styles.title}>Tableau de bord</Text>
      
      <View style={styles.kpiRow}>
        <Carte style={styles.kpi}>
          <Text style={styles.kpiValue}>{kpis.totalProduits}</Text>
          <Text style={styles.kpiLabel}>Produits</Text>
        </Carte>
        
        <Carte style={styles.kpi}>
          <Text style={styles.kpiValue}>{kpis.totalStock}</Text>
          <Text style={styles.kpiLabel}>Stock total</Text>
        </Carte>
        
        <Carte style={[styles.kpi, styles.kpiWarn]}>
          <Text style={styles.kpiValue}>{kpis.nbFaibleStock}</Text>
          <Text style={styles.kpiLabel}>Stock faible (&lt;{kpis.seuil})</Text>
        </Carte>
      </View>

      <View style={styles.sectionRow}>
        <Carte style={styles.section}>
          <Text style={styles.sectionTitle}>Top stock</Text>
          {chargement && <Text>Chargement…</Text>}
          {!chargement && topStock.length === 0 && (
            <Text style={styles.muted}>Aucun produit</Text>
          )}
          {!chargement && topStock.map(p => (
            <LigneBar 
              key={p.id} 
              label={`${p.name} (SKU ${p.sku})`}
              value={Number(p.stock || 0)} 
              max={maxStock} 
            />
          ))}
        </Carte>

        <Carte style={styles.section}>
          <Text style={styles.sectionTitle}>Stock faible (&lt;{kpis.seuil})</Text>
          {chargement && <Text>Chargement…</Text>}
          {!chargement && faibles.length === 0 && (
            <Text style={styles.muted}>Aucun produit à stock faible</Text>
          )}
          {!chargement && (
            <FlatList
              data={faibles}
              scrollEnabled={false}
              keyExtractor={it => String(it.id)}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.rowName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.rowMeta}>Stock : {item.stock}</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </Carte>
      </View>

      <Carte style={styles.sectionFull}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        {chargement && <Text>Chargement…</Text>}
        {!chargement && recents.length === 0 && (
          <Text style={styles.muted}>Aucune donnée</Text>
        )}
        {!chargement && (
          <FlatList
            data={recents}
          scrollEnabled={false}
            keyExtractor={it => String(it.id)}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.rowMeta}>
                    SKU : {item.sku} • Stock : {item.stock}
                  </Text>
                </View>
                <Text style={styles.rowMeta}>
                  {item.createdAt 
                    ? new Date(item.createdAt).toLocaleDateString() 
                    : '—'
                  }
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </Carte>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '800', 
    marginBottom: 12 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1, 
    borderColor: '#e5e7eb'
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  kpi: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  kpiWarn: { 
    borderColor: '#fca5a5' 
  },
  kpiValue: { 
    fontSize: 20, 
    fontWeight: '800' 
  },
  kpiLabel: {
    color: '#6b7280',
    marginTop: 4, 
    textAlign: 'center'
  },
  sectionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  section: { 
    flex: 1, 
    minHeight: 180 
  },
  sectionFull: { 
    marginTop: 0, 
    minHeight: 180 
  },
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 8
  },
  muted: { 
    color: '#6b7280' 
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  barLabel: {
    maxWidth: '75%',
    fontWeight: '600'
  },
  barValue: { 
    color: '#6b7280' 
  },
  barTrack: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 6
  },
  barFill: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowName: { 
    fontWeight: '600' 
  },
  rowMeta: { 
    color: '#6b7280' 
  },
  separator: {
    height: 6
  }
});