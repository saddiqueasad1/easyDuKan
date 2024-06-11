import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { IItem } from "../../utills/types";
import { Color } from "../../utills/GlobalStyles";

interface ProductItemProps {
  item: IItem;
}

const RanderBillItems: React.FC<ProductItemProps> = ({ item }) => {
  return (
    <View style={styles.itemTouchable}>
      <View style={styles.itemCard}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
          <Text style={styles.itemText}>Unit Price: {item.unitPrice}</Text>
          <Text style={styles.itemText}>Total: {item.total}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemTouchable: {
    marginBottom: 5,
  },
  itemCard: {
    backgroundColor: Color.colorWhite,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 14,
  },
});

export default RanderBillItems;
