import React from "react";

import PlacesNavigator from "./navigation/PlacesNavigator";

import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import placesReducer from "./store/places-reducer";

import {init} from './helpers/db';

init().then(()=>{
  console.log('Se creo de manera exitosa la base de datos')
}).catch(err => {
  console.log('Algo fallo en la base de datos')
  console.log(err);
})

const rootReducer = combineReducers({
  places: placesReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <PlacesNavigator />
    </Provider>
  );
}
