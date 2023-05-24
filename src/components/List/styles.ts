import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center"
  },
  listItemTitle: {
    fontWeight: "800",
    fontSize: 18
  },
  listItemText: {
    fontWeight: "300",
    fontSize: 18
  },
  button: {
    borderRadius: 50,
    backgroundColor: "red",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  }
});