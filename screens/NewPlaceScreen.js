import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";

import ImagePicker from "../components/ImagePicker";

import { useDispatch } from "react-redux";
import * as placesActions from "../store/places-actions";
import LocationPicker from "../components/LocationPicker";

import Colors from "../constants/Colors";

const NewPlaceScreen = (props) => {
  const dispatch = useDispatch();

  const [titleValue, setTitleValue] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState();

  const titleChangeHandler = (text) => {
    //Validación
    setTitleValue(text);
  };

  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const savePlaceHandler = () => {
    dispatch(placesActions.addPlace(titleValue, selectedImage, selectedLocation));
    props.navigation.goBack();
  };

  const locationPickedHandler = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        <ImagePicker onImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={props.navigation}
          onLocationPicked={locationPickedHandler}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Nuevo Lugar"
            color={Colors.primary}
            onPress={savePlaceHandler}
          />
        </View>
      </View>
    </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = {
  headerTitle: "Nuevo Lugar",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  form: {
    margin: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.accent,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  buttonContainer: {
    overflow: "hidden",
    borderRadius: 20,
  },
});

export default NewPlaceScreen;
