import * as React from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const buildLeafletHTML = ({ center, points = [] }) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; overflow: hidden; }
    #map { height: 100vh; width: 100vw; }
    .leaflet-container { height: 100%; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const center = [${center.lat}, ${center.lng}];

      // Initialiser la carte
      const map = L.map('map').setView(center, 13);

      // Tuiles personnalisées
      L.tileLayer('http://192.168.15.110/Tiles/OSM/{z}/{x}/{y}.png', {
        attribution: 'Vos tuiles personnalisées',
        maxZoom: 18,
        minZoom: 1
      }).addTo(map);

      // Marqueur de position utilisateur
      L.marker(center)
        .addTo(map)
        .bindPopup('Vous êtes ici');

      // Ajouter les points
      const points = ${JSON.stringify(points)};
      points.forEach(point => {
        L.marker([point.lat, point.lng])
          .addTo(map)
          .bindPopup('<b>' + point.title + '</b><br/>' + point.desc)
          .on('click', function() {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'marker_tap',
                data: point
              }));
            }
          });
      });

      // Redimensionner la carte après rendu
      setTimeout(() => map.invalidateSize(), 100);
    });
  </script>
</body>
</html>
`;

export default function MapLeafletScreen() {
  const [center, setCenter] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const webRef = React.useRef(null);

  const seedPoints = React.useMemo(() => ([
    { id: '1', title: 'Point A', desc: 'Exemple A', lat: 36.8065, lng: 10.1815 },
    { id: '2', title: 'Point B', desc: 'Exemple B', lat: 36.8479, lng: 10.2727 },
  ]), []);

  React.useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        let coords = { latitude: 36.8065, longitude: 10.1815 };
       
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          coords = location.coords;
        }

        setCenter({ lat: coords.latitude, lng: coords.longitude });
        setLoading(false);
      } catch (error) {
        setCenter({ lat: 36.8065, lng: 10.1815 });
        setLoading(false);
      }
    })();
  }, []);

  const onMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'marker_tap') {
        Alert.alert(message.data.title, message.data.desc);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  if (loading || !center) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{ html: buildLeafletHTML({ center, points: seedPoints }) }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        onMessage={onMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});