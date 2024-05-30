import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Color } from "../utills/GlobalStyles";
import ContactSuggestions from "../components/ContactSuggestions";
import * as Print from "expo-print";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import RanderBillItems from "../components/BillingComponents/randerBillItems";

const BillingDetailScreen = () => {
  const [customerName, setCustomerName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const bill = useSelector((state: RootState) => state.bill.bill);
  const BillItems = bill?.items;
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const viewRef = useRef(null);
  const db = getFirestore();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;

  const saveDetails = async () => {
    try {
      console.log("saveDetails");
      let myBill = {
        ...bill,
        customerName: customerName,
      };
      console.log("myBill");
      console.log(myBill);

      const result = await addDoc(
        collection(db, "users", userId, "bills"),
        myBill,
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const shareAsImage = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });
      saveDetails();
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
      saveDetails();
      await Sharing.shareAsync(`file://${uri}`, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container} ref={viewRef}>
        <Text style={styles.label}>Customer Name:</Text>
        <ContactSuggestions
          contacts={contacts}
          onSelectContact={setCustomerName}
        />
        <Text style={styles.label}>Billing Details:</Text>
        <FlatList
          data={BillItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RanderBillItems item={item} />}
          ListEmptyComponent={<Text>No items available</Text>}
          style={styles.itemContainer}
        />
        <Text style={styles.total}>Total Qty: {bill?.totalQuantity}</Text>
        <Text style={styles.total}>Total Amount: Rs: {bill?.totalAmount}</Text>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity
          onPress={saveDetails}
          style={styles.rectangleViewBorder}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rectangleViewBorder}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Save & Share</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                shareAsImage();
              }}
            >
              <Text style={styles.buttonText}>Share as Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                shareAsPDF();
              }}
            >
              <Text style={styles.buttonText}>Share as PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 10,
  },
  buttonText: {
    color: Color.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: Color.primaryColor,
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
  },
});

export default BillingDetailScreen;
