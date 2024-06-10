import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IBill, IItem, IProduct } from "../utills/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";

import {
  decreaseQuantity,
  increaseQuantity,
  removeAllBills,
  setBill,
} from "../redux/slices/billSlice";
import { setClearAll, setProduct } from "../redux/slices/productSlice";
import ProductItem from "../components/ProductComponents/ProductItem";
import { Color } from "../utills/GlobalStyles";
import Header from "../components/Head";
import ScreenWrapper from "../components/ScreenWrapper";
import { height, width } from "../utills/Dimension";
import Icons from "../assets/images";
import ContentLoader from "react-native-easy-content-loader";

const ProductsScreen = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const products = useSelector((state: RootState) => state.products);
  const bill = useSelector((state: RootState) => state.bill.bill);
  const { categories } = useSelector((state: RootState) => state.categories);
  const db = getFirestore();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  const [loader, setLoader] = useState(false);
  const [selectValue, SetSelectValue] = useState("0");

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid, db]);

  const fetchItems = async () => {
    try {
      setLoader(true);
      const itemsCollectionRef = collection(db, "users", user.uid, "products");
      const itemsSnapshot = await getDocs(itemsCollectionRef);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setProduct(itemsList as any));
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
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
      scrollEnabled={true}
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.floatingButton2}
              onPress={() => {
                dispatch(removeAllBills());
              }}
            >
              <MaterialIcons name="delete" color={"white"} size={height(3)} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("BillingDetailScreen")}
            >
              <View style={styles.floatingButton}>
                <Text style={styles.floatingText}> {bill.totalQuantity}</Text>
                <Text style={styles.floatingText}> View Bill</Text>
                <Text style={styles.floatingText}>Rs: {bill?.totalAmount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        );
      }}
    >
      <View style={styles.container}>
        <FlatList
          data={products}
          scrollEnabled={false}
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
          ListEmptyComponent={
            !loader ? (
              <View
                style={{
                  alignItems: "center",
                  height: height(70),
                  backgroundColor: "white",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={Icons.empty}
                  style={{ height: height(30), width: height(30) }}
                />
                <Text
                  style={{
                    fontSize: height(1.2),
                    margin: height(3),
                  }}
                >
                  No Product found
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditProductScreen", {
                      userId: user?.uid,
                    });
                  }}
                  style={styles.drawrbtn}
                >
                  <AntDesign name="plus" size={height(2)} />
                  <Text style={styles.dbtext}>Add New Product</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <ContentLoader
                  containerStyles={{ padding: height(1) }}
                  active
                  avatar
                  aShape="square"
                  aSize={height(8)}
                  pRows={2}
                  tWidth={width(73)}
                  tHeight={height(2)}
                  pHeight={[height(1), height(1)]}
                  pWidth={[width(60), width(70)]}
                />
                <ContentLoader
                  containerStyles={{ padding: height(1) }}
                  active
                  avatar
                  aShape="square"
                  aSize={height(8)}
                  pRows={2}
                  tWidth={width(73)}
                  tHeight={height(2)}
                  pHeight={[height(1), height(1)]}
                  pWidth={[width(60), width(70)]}
                />
                <ContentLoader
                  containerStyles={{ padding: height(1) }}
                  active
                  avatar
                  aShape="square"
                  aSize={height(8)}
                  pRows={2}
                  tWidth={width(73)}
                  tHeight={height(2)}
                  pHeight={[height(1), height(1)]}
                  pWidth={[width(60), width(70)]}
                />
                <ContentLoader
                  containerStyles={{ padding: height(1) }}
                  active
                  avatar
                  aShape="square"
                  aSize={height(8)}
                  pRows={2}
                  tWidth={width(73)}
                  tHeight={height(2)}
                  pHeight={[height(1), height(1)]}
                  pWidth={[width(60), width(70)]}
                />
                <ContentLoader
                  containerStyles={{ padding: height(1) }}
                  active
                  avatar
                  aShape="square"
                  aSize={height(8)}
                  pRows={2}
                  tWidth={width(73)}
                  tHeight={height(2)}
                  pHeight={[height(1), height(1)]}
                  pWidth={[width(60), width(70)]}
                />
                <ContentLoader
                  containerStyles={{ padding: height(1) }}
                  active
                  avatar
                  aShape="square"
                  aSize={height(8)}
                  pRows={2}
                  tWidth={width(73)}
                  tHeight={height(2)}
                  pHeight={[height(1), height(1)]}
                  pWidth={[width(60), width(70)]}
                />
              </>
            )
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: width(1),
    marginBottom: height(2),
  },
  noItemsText: {
    textAlign: "center",
    color: Color.colorDarkslateblue,
    marginVertical: 20,
  },
  itemsList: {
    // paddingBottom: 20,
  },
  floatingButton: {
    borderRadius: height(5),
    backgroundColor: Color.primaryColor,
    paddingHorizontal: height(2),
    paddingVertical: height(2),
    flexDirection: "row",
    justifyContent: "space-between",
    width: width(80),
    alignSelf: "center",
  },
  floatingButton2: {
    borderRadius: height(5),
    backgroundColor: "red",
    padding: height(1.2),
    margin: height(0.5),
  },
  floatingText: {
    color: Color.colorWhite,
    fontWeight: "bold",
  },
  drawrbtn: {
    padding: height(2),
    backgroundColor: Color.secondaryColor,
    marginVertical: height(0.5),
    marginHorizontal: height(1),
    borderRadius: height(3),
    flexDirection: "row",
  },
  dbtext: {
    fontSize: height(1.6),
    fontWeight: "500",
    marginHorizontal: height(1),
  },
});

export default ProductsScreen;
