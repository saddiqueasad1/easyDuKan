import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { AppDispatch, RootState } from "../redux/store";

const BillScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const bills = useSelector((state: RootState) => state.bills.bills);
  console.log("bills");
  console.log(bills);

  const handleAddItem = () => {
    const newItem = {
      id: "uuidv4()",
      description: "New Item",
      quantity: 1,
      unitPrice: 100,
      total: 100,
    };
  };

  const handleRemoveItem = (itemId: string) => {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bill Items</Text>
      <FlatList
        data={bills || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.customerName}</Text>
            <Button title="Remove" onPress={() => handleRemoveItem(item.id)} />
          </View>
        )}
      />
      <Button title="Add Item" onPress={handleAddItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default BillScreen;
