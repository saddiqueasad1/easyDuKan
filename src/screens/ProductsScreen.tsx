import React, { useEffect, useState } from "react";
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
import { Color } from "../utills/GlobalStyles";
import Header from "../components/Head";
import ScreenWrapper from "../components/ScreenWrapper";
import { height, width } from "../utills/Dimension";
  const categories: Category[] = [
    { id: "0", name: "All" },
    { id: "1", name: "Clothes" },
    { id: "2", name: "Shoes" },
    { id: "3", name: "Kind" },
    { id: "4", name: "Clothes" },
    { id: "5", name: "Shoes" },
    { id: "6", name: "Kind" },
    { id: "17", name: "Clothes" },
    { id: "27", name: "Shoes" },
    { id: "38", name: "Kind" },

    // Add more categories as needed
  ];
const ProductsScreen = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const products = useSelector((state: RootState) => state.products);
  const bill = useSelector((state: RootState) => state.bill.bill);
  const db = getFirestore();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [selectValue, SetSelectValue] = useState("0");

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
    item: IProduct
  ) => {
    const updatedItem: IItem = {
      ...item,
      quantity: currentQuantity + 1,
      total: (currentQuantity + 1) * item?.unitPrice,
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
        purchasePrice: item.purchasePrice,
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
        totalQuantity: 1,
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
    item: IProduct
  ) => {
    const updatedItem: IItem = {
      ...item,
      quantity: currentQuantity - 1,
      total: (currentQuantity - 1) * item?.unitPrice,
    };

    if (bill) {
      dispatch(decreaseQuantity(updatedItem));
    }
  };
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Header
          searchText={searchText}
          setSearchText={setSearchText}
          selectValue={selectValue}
          SetSelectValue={SetSelectValue}
          categories={categories}
        />
      )}
      footerUnScrollable={() => {
        return bill?.totalAmount !== undefined && bill?.totalAmount !== 0 ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("BillingDetailScreen")}
          >
            <View style={styles.floatingButton}>
              <Text style={styles.floatingText}> {bill.totalQuantity}</Text>
              <Text style={styles.floatingText}> View Bill</Text>
              <Text style={styles.floatingText}>Rs: {bill?.totalAmount}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        );
      }}
    >
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (
              item?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
            ) {
              return (
                <ProductItem
                  item={item}
                  navigation={navigation}
                  handleIncreaseQuantity={handleIncreaseQuantity}
                  handleDecreaseQuantity={handleDecreaseQuantity}
                />
              );
            }
          }}
          contentContainerStyle={styles.itemsList}
          numColumns={2}
          ListEmptyComponent={
            <Text style={styles.noItemsText}>No items available</Text>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    marginHorizontal:width(1)
  },
  noItemsText: {
    textAlign: "center",
    color: Color.colorDarkslateblue,
    marginVertical: 20,
  },
  itemsList: {
    paddingBottom: 20,
  },
  floatingButton: {
    borderRadius: height(5),
    backgroundColor: Color.primaryColor,
    position: "absolute",
    bottom: height(1),
    paddingHorizontal: height(2),
    paddingVertical: height(2),
    flexDirection: "row",
    justifyContent: "space-between",
    width: width(96),
    alignSelf:'center'
  },
  floatingText: {
    color: Color.colorWhite,
    fontWeight: "bold",
  },
});

export default ProductsScreen;
