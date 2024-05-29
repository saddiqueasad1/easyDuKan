import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { captureRef } from "react-native-view-shot";
// import Share from "react-native-share";
import * as Sharing from "expo-sharing";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { IItem } from "../utills/types";
import { Color } from "../utills/GlobalStyles";
import ContactSuggestions from "../components/ContactSuggestions";
import * as Print from "expo-print";

const BillingDetailScreen = () => {
  const [customerName, setCustomerName] = useState("");
  const bill = useSelector((state: RootState) => state.bill.bill);
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const viewRef = useRef(null);

  const saveDetails = () => {
    Alert.alert(
      customerName,
      "Customer billing details have been saved successfully. ",
    );
  };

  const shareAsImage = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Share Image",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const shareAsPDF = async () => {
    const htmlContent = `
    <h1>Billing Details</h1>
    <p>Customer Name: ${customerName}</p>
    <p>Total Quantity: ${bill?.totalQuantity}</p>
    <p>Total Amount: Rs: ${bill?.totalAmount}</p>
    <ul>
      ${bill?.items
        .map(
          (item) => `
        <li>
          <p>Item: ${item.name}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Unit Price: ${item.unitPrice}</p>
          <p>Total: ${item.total}</p>
        </li>
      `,
        )
        .join("")}
    </ul>
  `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(`file://${uri}`, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: IItem }) => (
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

  return (
    <View style={styles.container} ref={viewRef}>
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
          onPress={shareAsImage}
        >
          <Text style={styles.buttonText}>Share as Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangleViewBorder}
          onPress={shareAsPDF}
        >
          <Text style={styles.buttonText}>Share as PDF</Text>
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
    // width: "38%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: Color.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BillingDetailScreen;
