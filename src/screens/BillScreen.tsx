import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AppDispatch, RootState } from "../redux/store";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { IBill } from "../utills/types";
import { setBills } from "../redux/slices/billsSlice";

const BillScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;
  const dispatch: AppDispatch = useDispatch();
  const bills = useSelector((state: RootState) => state.bills.bills);
  const bill = useSelector((state: RootState) => state.bill);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const db = getFirestore();

  useEffect(() => {
    const loadBills = async () => {
      setLoading(true);
      try {
        const billsData = await fetchBills(userId);
        dispatch(setBills(billsData));
      } catch (err) {
        setError("Error fetching bills. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBills();
  }, [userId, bill]);

  const fetchBills = async (userId: string): Promise<IBill[]> => {
    const billsCollection = collection(db, "users", userId, "bills");
    const billsSnapshot = await getDocs(billsCollection);
    const billsList: IBill[] = billsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as IBill),
    }));
    return billsList;
  };
  const handleDetail = (item: IBill) => {
    navigation.navigate("BillingDetailScreen", { bill: item });
  };
  const handleReports = () => {
    navigation.navigate("DailyReportScreen");
  };

  const renderBillItem = ({ item, index }: { item: IBill; index: number }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleDetail(item)}>
      <Text style={styles.index}>{index + 1}</Text>
      <View style={styles.billDetails}>
        <Text>{item.customerName}</Text>
        <Text>Total Quantity: {item.totalQuantity}</Text>
        <Text>Total Amount: {item.totalAmount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.header}>Bill Items</Text>
        {/* <TouchableOpacity onPress={() => handleReports()}>
          <Text style={styles.header}>Reports</Text>
        </TouchableOpacity> */}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={bills || []}
          keyExtractor={(_item, index) => String(index)}
          renderItem={renderBillItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bills available</Text>
          }
        />
      )}
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
  loader: {
    marginTop: 20,
  },
  error: {
    marginTop: 20,
    color: "red",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  index: {
    fontWeight: "bold",
    marginRight: 10,
  },
  billDetails: {
    flex: 1,
  },
});

export default BillScreen;
