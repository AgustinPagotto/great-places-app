import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("places.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //tx es una transacción, lo que hace es que si falla alguna parte de la base de datos vuelve todo a el estado anterior, asi no perdemos datos o tenemos datos corruptos
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);",
        [],
        () => {
          //Funcion exito
          resolve();
        },
        (_, err) => {
          //Funcion Error
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const insertPlace = (title, imageUri, address, lat, lng) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?);`,
            [title, imageUri, address, lat, lng],
            (_, result) => {
              resolve(result);
            },
            (_, err) => {
              reject(err);
            }
          );
        });
      });
      return promise;
};

export const fetchPlaces = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM places",
            [],
            (_, result) => {
              resolve(result);
            },
            (_, err) => {
              reject(err);
            }
          );
        });
      });
      return promise;
}