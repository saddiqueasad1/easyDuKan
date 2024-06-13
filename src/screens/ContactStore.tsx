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
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Color } from "../utills/GlobalStyles";
import { IProduct, IProfile } from "../utills/types";
import ProductShopItem from "../components/ProductComponentShop/ProductItem";
import { height, width } from "../utills/Dimension";

const ContactProfileScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { userId } = route.params;
  const [user, setUser] = useState<IProfile>();
  const profile = useSelector((state: RootState) => state.profile);
  const order = useSelector((state: RootState) => state.order.order);
  const [products, setProduct] = useState();
  const db = getFirestore();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as IProfile;
          console.log("og of other profile", data);
          setUser(data);
          fetchItems(data.branchIds[0] + "");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, db, profile]);

  const fetchItems = async (selectedBranchId = "") => {
    console.log("user----------------");
    console.log(user);
    try {
      const itemsCollectionRef = collection(
        db,
        "branches",
        selectedBranchId,
        "products",
      );
      // console.log("itemsCollectionRef id", itemsCollectionRef);

      const itemsSnapshot = await getDocs(itemsCollectionRef);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("+");

      setProduct(itemsList);
    } catch (error) {
      console.log("this one ", error);
    }
  };

  const renderItem = ({ item }: { item: IProduct }) => {
    return <ProductShopItem item={item} navigation={undefined} />;
  };

  const handleOrder = () => {
    console.log("loading order");
  };

  const headerItem = () => (
    <>
      <View style={styles.profile}>
        <FontAwesome5 name="user-tie" size={50} color={Color.primaryColor} />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.contact}>{user?.phoneNumber}</Text>
          <Text style={styles.address}>{user?.address}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            const new_user = { ...user, userId };
            console.log(new_user);

            navigation.navigate("ChatScreen", {
              usr: new_user,
              userRoom: user?.roomId,
            });
          }}
        >
          <Ionicons
            name="chatbubbles-sharp"
            size={20}
            color={Color.primaryColor}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Products</Text>
        {/* <TouchableOpacity style={styles.addButton} onPress={addIProduct}>
          <Text style={styles.addButtonText}>Add Products</Text>
        </TouchableOpacity> */}
      </View>
    </>
  );

  return (
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
        numColumns={2}
      />

      <TouchableOpacity onPress={() => handleOrder()}>
        <View style={styles.floatingButton}>
          <Text style={styles.floatingText}> {order?.totalQuantity}</Text>
          <Text style={styles.floatingText}> View Bill</Text>
          <Text style={styles.floatingText}>Rs: {order?.totalAmount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    margin: height(3),
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
    margin: height(2),
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
  floatingText: {
    color: Color.colorWhite,
    fontWeight: "bold",
  },
});

export default ContactProfileScreen;
