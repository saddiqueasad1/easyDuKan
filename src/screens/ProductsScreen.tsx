import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IBill, IItem, IProduct } from "../utills/types";
import {
  decreaseQuantity,
  increaseQuantity,
  setBill,
} from "../redux/slices/billSlice";
import { setProduct } from "../redux/slices/productSlice";
import ProductItem from "../components/ProductComponents/ProductItem";

const ProductsScreen = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const products = useSelector((state: RootState) => state.products);
  const bill = useSelector((state: RootState) => state.bill.bill);
  const db = getFirestore();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid, db]);

  const fetchItems = async () => {
    try {
      const itemsCollectionRef = collection(db, "users", user.uid, "products");
      const itemsSnapshot = await getDocs(itemsCollectionRef);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setProduct(itemsList as any));
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncreaseQuantity = (
    id: string,
    currentQuantity: number,
    item: IProduct,
  ) => {
    const updatedItem: IItem = {
      ...item,
      quantity: currentQuantity + 1,
      total: (currentQuantity + 1) * item?.unitPrice,
      totalAmount: 0,
    };

    if (bill) {
      dispatch(increaseQuantity(updatedItem));
    } else {
      const itemNew: IItem = {
        id,
        description: item.description,
        quantity: 1,
        unitPrice: item.unitPrice,
        total: item.unitPrice,
        totalAmount: item.unitPrice,
        name: item.name,
      };

      const newBill: IBill = {
        id: generateId(), // Assuming user.uid is used as billId
        customerId: "", // Provide customer ID here
        customerName: "", // Provide customer name here
        date: new Date().toISOString(), // Use current date and time
        totalAmount: updatedItem.total,
        status: "pending", // Set initial status
        items: [itemNew],
      };
      dispatch(setBill(newBill));
    }
  };

  function generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  const handleDecreaseQuantity = (
    id: string,
    currentQuantity: number,
    item: IProduct,
  ) => {
    const updatedItem: IItem = {
      ...item,
      quantity: currentQuantity - 1,
      total: (currentQuantity - 1) * item?.unitPrice,
      totalAmount: 0,
    };

    if (bill) {
      dispatch(decreaseQuantity(updatedItem));
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            navigation={navigation}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
          />
        )}
        contentContainerStyle={styles.itemsList}
        numColumns={2}
        ListEmptyComponent={
          <Text style={styles.noItemsText}>No items available</Text>
        }
      />
      <TouchableOpacity>
        <View style={styles.floatingButton}>
          <Text style={styles.noItemsText}>{bill?.totalAmount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
    marginTop: 30,
  },
  noItemsText: {
    textAlign: "center",
    color: "#6c757d",
    marginVertical: 20,
  },
  itemsList: {
    paddingBottom: 20,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ee6e73",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default ProductsScreen;
