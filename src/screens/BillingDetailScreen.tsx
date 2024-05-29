// BillingDetailScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { IItem } from "../utills/types";
import { Color } from "../utills/GlobalStyles";

const BillingDetailScreen = () => {
  const [customerName, setCustomerName] = useState("");
  const bill = useSelector((state: RootState) => state.bill.bill);

  const saveDetails = () => {
    Alert.alert(
      "Details Saved",
      "Customer billing details have been saved successfully.",
    );
  };

  const shareOnWhatsApp = () => {};

  const renderItem = ({ item }: { item: IItem }) => {
    return (
      <TouchableOpacity>
        <View>
          <Text>{item.name}</Text>
          <Text>{item.quantity}</Text>
          <Text>{item.unitPrice}</Text>
          <Text>{item.total}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customer Name:</Text>
      <TextInput
        style={styles.input}
        value={customerName}
        onChangeText={setCustomerName}
      />
      <Text style={styles.label}>Billing Details:</Text>
      <FlatList
        data={bill?.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No items available</Text>}
        style={styles.itemContainer}
      />

      <Text style={styles.total}>Total Amount: Rs: {0}</Text>
      <View style={styles.containerButton}>
        <TouchableOpacity
          onPress={saveDetails}
          style={styles.rectangleViewBorder}
        >
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangleViewBorder}
          onPress={shareOnWhatsApp}
        >
          <Text>Share on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
  },
  itemContainer: {
    marginBottom: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  rectangleViewBorder: {
    backgroundColor: Color.primaryColor,
    height: 50,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default BillingDetailScreen;
