import * as FileSystem from "expo-file-system";
import ENV from "../env";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";

import { insertPlace, fetchPlaces } from "../helpers/db";

export const addPlace = (title, image, location) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`
    );

    const fileName = image.split("/").pop();
    const newPath = FileSystem.documentDirectory + fileName;

    if (!response.ok) {
      throw new Error("Algo sucedio");
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error("Algo sucedio");
    }
    const address = resData.results[0].formatted_address;
    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath,
      });
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );
      console.log(dbResult);
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: { lat: location.lat, lng: location.lng },
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async (dispatch) => {
    try {
      const dbResult = await fetchPlaces();
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};
