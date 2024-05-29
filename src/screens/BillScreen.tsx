import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { AppDispatch, RootState } from "../redux/store";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { IBill } from "../utills/types";
import { setBills } from "../redux/slices/billsSlice";

const BillScreen = () => {
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;
  const dispatch: AppDispatch = useDispatch();
  const bills = useSelector((state: RootState) => state.bills.bills);
  console.log("bills");
  console.log(bills);
  const db = getFirestore();


  useEffect(() => {
    const loadBills = async () => {
      try {
        const billsData = await fetchBills(userId);
        console.log('billsData');
        console.log(billsData);
        dispatch(setBills(billsData));
      } catch (err) {
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    loadBills();
  }, [userId]);


  const fetchBills = async (userId: string): Promise<IBill[]> => {
    const billsCollection = collection(db, "users", userId, "bills");
    const billsSnapshot = await getDocs(billsCollection);
    const billsList: IBill[] = billsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as IBill),
    }));
    return billsList;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bill Items</Text>
      <FlatList
        data={bills || []}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => (

          <View style={styles.item}>
            <Text>{index}</Text>
            <Text>{item.customerName}</Text>
            <Text>{item.totalQuantity}</Text>
            <Text>{item.totalAmount}</Text>
          </View>
        )}
      />
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
