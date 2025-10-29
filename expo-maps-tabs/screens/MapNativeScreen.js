import * as React from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Platform, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';


export default function MapNativeScreen() {
  const [region, setRegion] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const mapRef = React.useRef(null);


  // Deux points autour de Tunis
  const seedPoints = React.useMemo(() => ([
    { id: '1', title: 'Point A', desc: 'Exemple A', latitude: 36.8065, longitude: 10.1815 }, // Tunis
    { id: '2', title: 'Point B', desc: 'Exemple B', latitude: 36.8479, longitude: 10.2727 }, // Ariana
  ]), []);


  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let coords = { latitude: 36.8065, longitude: 10.1815 }; // fallback Tunis


      if (status === 'granted') {
        try {
          const pos = await Location.getCurrentPositionAsync({});
          coords = pos.coords;
        } catch (e) {
          // garder fallback
        }
      } else {
        Alert.alert('Localisation', 'Permission refusée. Position par défaut : Tunis.');
      }


      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setLoading(false);
    })();
  }, []);


  const fitAll = () => {
    if (!mapRef.current) return;
    const items = [
      ...seedPoints.map(p => ({ latitude: p.latitude, longitude: p.longitude })),
      region && { latitude: region.latitude, longitude: region.longitude },
    ].filter(Boolean);


    mapRef.current.fitToCoordinates(items, {
      edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
      animated: true,
    });
  };


  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
        onRegionChangeComplete={setRegion}
      >
        {/* Cercle autour de la position utilisateur */}
        <Circle
          center={{ latitude: region.latitude, longitude: region.longitude }}
          radius={150}
          strokeWidth={1}
          fillColor="rgba(70, 180, 120, 0.2)"
          strokeColor="rgba(70, 180, 120, 0.6)"
        />


        {/* Marqueurs d'exemple */}
        {seedPoints.map(p => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.title}
            description={p.desc}
            onPress={() => Alert.alert('Marqueur', `${p.title}\n${p.desc}`)}
          />
        ))}
      </MapView>


      <TouchableOpacity style={styles.fab} onPress={fitAll}>
        <Text style={styles.fabText}>Voir tous les points</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#111',
    borderRadius: 8,
  },
  fabText: { color: '#fff', fontWeight: '600' },
});

