import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { createTable, db } from "./src/config/db";
import { List } from "./src/components/List";

const INITIAL_STATE = {
  name: "",
  ra: "",
  sigla: "",
};

export default function App() {
  const [list, setList] = useState<Next[]>([]);
  const [data, setData] = useState(INITIAL_STATE);

  const IS_DISABLED = !Boolean(data.name && data.ra && data.sigla);

  useEffect(() => {
    createTable();
    getData();
    getFieldsInStorage();
  }, []);

  useEffect(() => {
    saveFieldsInStorage();
  }, [data]);

  async function getFieldsInStorage() {
    const data = await AsyncStorage.getItem('data');

    if (data) setData(JSON.parse(data));
  }

  async function saveFieldsInStorage() {
    await AsyncStorage.setItem('data', JSON.stringify(data));
  }

  async function saveData() {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO nextFiap (name, ra, sigla) VALUES(?, ?, ?)",
        [data.name, data.ra, data.sigla],
        () => {
          Alert.alert("Cadastro para o NEXT realizado com sucesso!");
          setData(INITIAL_STATE);
          getData();
        },
        (_, error) => {
          Alert.alert("Algo deu errado!");
          return false;
        }
      );
    });
  }

  async function getData() {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM nextFiap ORDER BY id ASC",
        [],
        (_, res) => {
          if (res.rows.length > 0) {
            let result = [];

            for (let index = 0; index < res.rows.length; index++) {
              const item = res.rows.item(index);
              result.push(item);
            }

            return setList(result);
          }

          return setList([]);
        }
      );
    });
  }

  async function deleteData(id: string) {
    db.transaction(tx => {
      tx.executeSql(
        "DELETE FROM nextFiap WHERE id = ?",
        [id],
        (_, res) => {
          if (res.rowsAffected > 0) {
            Alert.alert("Registro deletado com sucesso!");
            getData();
          }
        },
        () => {
          Alert.alert("Algo deu errado!");
          return false;
        }
      );
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={undefined}>
      <ScrollView>
        <View style={styles.container}>
          <StatusBar barStyle="default" />

          <View>
            <Text style={styles.headerText}>NEXT - FIAP</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.box}>
              <Text style={styles.label}>Nome</Text>
              <TextInput style={styles.input}
                value={data.name} onChangeText={name => setData({ ...data, name })} />
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>RA</Text>
              <TextInput style={styles.input} keyboardType="numeric"
                value={data.ra} onChangeText={ra => setData({ ...data, ra })} />
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Sigla do curso</Text>
              <TextInput style={styles.input} autoCapitalize="characters"
                value={data.sigla} onChangeText={sigla => setData({ ...data, sigla })} />
            </View>

            <TouchableOpacity style={[styles.button, IS_DISABLED && styles.disabled]} disabled={IS_DISABLED} onPress={saveData}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          <View>
            {list.length <= 0 && (
              <Text style={[styles.headerText, styles.noResults]}>Não há registros salvos</Text>
            )}
            <FlatList
              contentContainerStyle={{ gap: 24 }}
              scrollEnabled={false}
              data={list}
              keyExtractor={data => data.id}
              renderItem={({ item }) => <List {...item} delete={() => deleteData(item.id)} />}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    gap: 32,
    padding: 24
  },
  headerText: {
    fontSize: 36,
    color: "#222",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    textAlign: "center"
  },
  noResults: {
    borderBottomWidth: 0,
    paddingTop: 32,
    fontSize: 48
  },
  form: {
    width: "100%",
    gap: 24
  },
  box: {
    width: "100%",
    gap: 8
  },
  label: {
    fontSize: 20,
    textTransform: "uppercase"
  },
  input: {
    borderWidth: 2,
    borderColor: "#222",
    width: "100%",
    fontSize: 16,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  button: {
    backgroundColor: "#ed145b",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60
  },
  buttonText: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 16
  },
  disabled: {
    backgroundColor: "#888",
    opacity: .5
  }
});
