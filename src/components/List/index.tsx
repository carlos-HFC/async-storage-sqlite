import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

type Props = Next & {
  delete(): void;
};

export function List(props: Props) {
  return (
    <View style={styles.list}>
      <View style={{ width: "85%", gap: 4 }}>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>Nome: </Text>
          <Text style={styles.listItemText}>{props.name}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>RA: </Text>
          <Text style={styles.listItemText}>{props.ra}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>Sigla do curso: </Text>
          <Text style={styles.listItemText}>{props.sigla}</Text>
        </View>
      </View>

      <View>
        <TouchableOpacity style={styles.button} onPress={props.delete}>
          <Feather name="trash" color="#fff" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}