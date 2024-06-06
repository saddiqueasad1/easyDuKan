import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../utills/GlobalStyles";
import { setProfile } from "../redux/slices/profilleSlice";
import { setProduct } from "../redux/slices/productSlice";
import { IProduct } from "../utills/types";
import { clearUser } from "../redux/slices/userSlice";
import ScreenWrapper from "../components/ScreenWrapper";
import { height, width } from "../utills/Dimension";
import Button from "../components/button";
import MyProductCard from "../components/MyProductCard/ProductItem";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const profile = useSelector((state: RootState) => state.profile);
  const products = useSelector((state: RootState) => state.products);
  const { username, email, address } = profile;
  const [phoneNumber] = useState(user.phoneNumber + "");
  const db = getFirestore();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const newData = { ...data, userId: user.uid };
          dispatch(setProfile(newData as any));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid, db, profile]);

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

  const renderItem = ({ item }: { item: IProduct }) => {
    return (
      <MyProductCard
        item={item}
        onPress={() =>
          navigation.navigate("EditProductScreen", {
            userId: user.uid,
            itemId: item.id,
          })
        }
      />
      // <TouchableOpacity
      //
      // >
      //   <View style={styles.item}>
      //     <Text style={styles.itemText}>Name: {item.name}</Text>
      //     <Text style={styles.itemText}>Description: {item.description}</Text>
      //     <Text style={styles.itemText}>Unit Price: {item.unitPrice}</Text>
      //     <Text style={styles.itemText}>
      //       {item.purchasePrice ? " Purchase Price:" + item.purchasePrice : ""}
      //     </Text>
      //     <Text style={styles.itemText}>
      //       Total Quantity: {item.totalQuantity}
      //     </Text>
      //   </View>
      // </TouchableOpacity>
    );
  };

  const addIProduct = async () => {
    navigation.navigate("EditProductScreen", {
      userId: user.uid,
    });
  };

  const headerItem = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Products</Text>
        <Button
          title={"Add Products"}
          onPress={addIProduct}
          containerStyle={{ width: width(20), paddingVertical: height(1.2) }}
          textStyle={{ fontSize: height(1.2) }}
        />
      </View>
    </>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.itemsList}
          ListHeaderComponent={headerItem}
          ListEmptyComponent={
            <Text style={styles.noItemsText}>No items available</Text>
          }
          numColumns={3}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: height(1.5),
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileInfo: {
    marginLeft: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  contact: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    marginLeft: "auto",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noItemsText: {
    textAlign: "center",
    color: "#6c757d",
    marginVertical: 20,
  },
  itemsList: {
    paddingBottom: 20,
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  itemText: {
    fontSize: 16,
    color: "#495057",
  },
});

export default ProfileScreen;
