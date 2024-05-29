import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { IItem } from "../utills/types";
import { Color } from "../utills/GlobalStyles";
import ContactSuggestions from "../components/ContactSuggestions";

const BillingDetailScreen = () => {
  const [customerName, setCustomerName] = useState("");
  const bill = useSelector((state: RootState) => state.bill.bill);
  const contacts = useSelector((state: RootState) => state.contacts.contacts);

  const saveDetails = () => {
    Alert.alert(
      customerName,
      "Customer billing details have been saved successfully. ",
    );
  };

  const shareOnWhatsApp = () => {
    if (!bill || bill.items.length === 0) {
      Alert.alert("No items available to share");
      return;
    }

    const message = `
    Customer Name: ${customerName}
    Billing Details:
    ${bill.items.map((item) => `Item: ${item.name}, Quantity: ${item.quantity}, Unit Price: ${item.unitPrice}, Total: ${item.total}`).join("\n")}
    Total Quantity: ${bill.totalQuantity}
    Total Amount: Rs: ${bill.totalAmount}
        `;

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("WhatsApp is not installed on this device");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const renderItem = ({ item }: { item: IItem }) => {
    return (
      <TouchableOpacity style={styles.itemTouchable}>
        <View style={styles.itemCard}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemText}>Unit Price: {item.unitPrice}</Text>
            <Text style={styles.itemText}>Total: {item.total}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customer Name:</Text>
      <ContactSuggestions
        contacts={contacts}
        onSelectContact={setCustomerName}
      />
      <Text style={styles.label}>Billing Details:</Text>
      <FlatList
        data={bill?.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No items available</Text>}
        style={styles.itemContainer}
      />

      <Text style={styles.total}>Total Qty: {bill?.totalQuantity}</Text>
      <Text style={styles.total}>Total Amount: Rs: {bill?.totalAmount}</Text>
      <View style={styles.containerButton}>
        <TouchableOpacity
          onPress={saveDetails}
          style={styles.rectangleViewBorder}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangleViewBorder}
          onPress={shareOnWhatsApp}
        >
          <Text style={styles.buttonText}>Share on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemTouchable: {
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: Color.colorWhite,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
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
  buttonText: {
    color: Color.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BillingDetailScreen;
