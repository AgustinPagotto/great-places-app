import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";

import Colors from "../constants/Colors";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import MapPreview from "./MapPreview";

const LocationPicker = (props) => {
  const [pickedLocation, setPickedLocation] = useState();
  const [isLoading, setIsLoading] = useState();

  const mapPickedLocation = props.navigation.getParam("pickedLocation");

  const {onLocationPicked} = props;

  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
      props.onLocationPicked( mapPickedLocation);
    }
  }, [mapPickedLocation, onLocationPicked]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert(
        "No se tiene los permisos suficientes",
        "Se necesitan permisos de localización para poder usar esta app",
        [{ text: "ok" }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }
    try {
      setIsLoading(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      props.onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (err) {
      Alert.alert(
        "No se pudo determinar tu ubicación",
        "Por favor intenta mas tarde o seleccióne usted una localizacion en el mapa",
        [{ text: "OK" }]
      );
    }
    setIsLoading(false);
  };

  const pickOnMapHandler = () => {
    props.navigation.navigate("Map");
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview
        onPress={pickOnMapHandler}
        style={styles.mapPreview}
        location={pickedLocation}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Text>No se selecciono una localización todavia</Text>
        )}
      </MapPreview>
      <View style={styles.actions}>
        <Button
          title="Ubicación actual"
          color={Colors.primary}
          onPress={getLocationHandler}
        />
        <Button
          title="Elegir ubicación"
          color={Colors.primary}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default LocationPicker;
