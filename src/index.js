import React, { useState, useEffect } from "react";

import { View, ActivityIndicator, StyleSheet } from "react-native";

import MapView, { Marker } from "react-native-maps";

import Geolocation from "@react-native-community/geolocation";

import api from "./services/api";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#7159c1",
    alignItems: "center",
    justifyContent: "center"
  },

  map: {
    ...StyleSheet.absoluteFillObject
  }
});

function App() {
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({});
  const [points, setPoints] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates(coords);
        setLoading(false);
      },
      error => {
        console.log(error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get(`/points`, {
          params: coordinates
        });

        setPoints(data);
      } catch (err) {
        console.log(err);
      }
    }

    if (coordinates) getData();
  }, [coordinates]);

  function renderPoints() {
    return points.map(point => (
      <Marker
        key={point.id}
        coordinate={{
          latitude: parseFloat(point.latitude),
          longitude: parseFloat(point.longitude)
        }}
        title={point.name}
      />
    ));
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <MapView
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0068,
            longitudeDelta: 0.0068
          }}
          style={styles.map}
        >
          {renderPoints()}
        </MapView>
      )}
    </View>
  );
}

export default App;
