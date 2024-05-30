import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Color } from "../utills/GlobalStyles";
import ContactSuggestions from "../components/ContactSuggestions";
import * as Print from "expo-print";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import RanderBillItems from "../components/BillingComponents/randerBillItems";
import { clearBill } from "../redux/slices/billSlice";
import { IBill } from "../utills/types";

const BillingDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const routeBill = route?.params?.bill as IBill;
  const bill = routeBill || useSelector((state: RootState) => state.bill.bill);
  const BillItems = bill?.items;
  const isDetail = !!routeBill;

  const [customerName, setCustomerName] = useState(
    routeBill?.customerName || "",
  );

  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const viewRef = useRef(null);
  const db = getFirestore();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;
  const dispatch = useDispatch();

  const saveDetails = async () => {
    console.log("()=> Save Details");
    if (!customerName.trim()) {
      alert("Customer name cannot be empty.");
      return;
    }
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(clearBill());
      navigation.goBack();
      setLoading(false);
    }
  };

  const shareAsImage = async () => {
    if (!customerName.trim()) {
      alert("Customer name cannot be empty.");
      return;
    }
    try {
      setLoading(true);
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Share Image",
      });
      if (!isDetail) await saveDetails();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const shareAsPDF = async () => {
    if (!customerName.trim()) {
      alert("Customer name cannot be empty.");
      return;
    }
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
      setLoading(true);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(`file://${uri}`, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
      });
      if (!isDetail) await saveDetails();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  console.log(bill);
  return (
    <View style={styles.container}>
      <View style={styles.containerRef} ref={viewRef}>
        <Text style={styles.label}>
          Customer Name: {isDetail && bill.customerName}
        </Text>
        {!isDetail && (
          <ContactSuggestions
            contacts={contacts}
            onSelectContact={setCustomerName}
          />
        )}
        <Text style={styles.label}>Billing Details:</Text>
        <FlatList
          data={BillItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RanderBillItems item={item} />}
          ListEmptyComponent={<Text>No items available</Text>}
          style={styles.itemContainer}
        />
        <View style={styles.viewTotal}>
          <Text style={styles.total}>Total Qty:</Text>
          <Text style={styles.total}>{bill?.totalQuantity}</Text>
        </View>
        <View style={styles.viewTotal}>
          <Text style={styles.total}>Total Amount:</Text>
          <Text style={styles.total}> Rs: {bill?.totalAmount}</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        {!isDetail && (
          <TouchableOpacity
            onPress={saveDetails}
            style={styles.rectangleViewBorder}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.rectangleViewBorder}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {isDetail ? "Share" : "Save & Share"}
          </Text>
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
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
  containerRef: {
    flex: 1,
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
    marginVertical: 3,
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
  spinnerTextStyle: {
    color: "#FFF",
  },
  viewTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1,
  },
});

export default BillingDetailScreen;
