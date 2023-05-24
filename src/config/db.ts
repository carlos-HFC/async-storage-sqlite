import * as sqlite from 'expo-sqlite';

export const db = sqlite.openDatabase("nextFiap.db");

export function createTable() {
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS nextFiap (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), ra VARCHAR(50), sigla VARCHAR(5))",
    );
  });
}