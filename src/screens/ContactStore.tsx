import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import {
  addDoc,
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
import GlobalMethods, { successMessage } from "../utills/GlobalMethods";
import { removeAllOrders } from "../redux/slices/orderSlice";
import { setAppLoader } from "../redux/slices/loaderSlice";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Head";
const d = [
  { id: 1, name: "Cloth" },
  { id: 2, name: "Shoes" },
  { id: 3, name: "Kid's" },
  { id: 4, name: "Men" },
];
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
  const [searchText, setSearchText] = useState("");
  const [selectValue, SetSelectValue] = useState("0");
  const db = getFirestore();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAppLoader(true));
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
        navigation.goBack();
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, db, profile]);

  const fetchItems = async (selectedBranchId = "") => {
    console.log("user----------------");
    console.log(user);
    try {
      // Reference to the branch document
      const branchDocRef = doc(db, "branches", selectedBranchId);
      // Get the branch document
      const branchDocSnapshot = await getDoc(branchDocRef);
      if (!branchDocSnapshot.exists()) {
        console.log("Branch not found!");
        return;
      }
      // Extract the branch name
      const branchName = branchDocSnapshot.data().branchName;

      setUser((prevUser) => ({
        ...prevUser,
        branchName,
      }));

      const itemsCollectionRef = collection(
        db,
        "branches",
        selectedBranchId,
        "products",
      );

      const itemsSnapshot = await getDocs(itemsCollectionRef);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProduct(itemsList);
    } catch (error) {
      console.log("this one ", error);
    } finally {
      dispatch(setAppLoader(false));
    }
  };

  const renderItem = ({ item }: { item: IProduct }) => {
    return (
      <ProductShopItem
        item={item}
        navigation={navigation}
        shopUser={user}
        shopUserId={userId}
      />
    );
  };

  const handleOrder = async () => {
    try {
      const result = await addDoc(collection(db, "orders"), order);
      successMessage("Make orders SuccessFuly");

      dispatch(removeAllOrders());
    } catch (error) {
      console.log(error);
    }
  };

  const headerItem = () => (
    <View style={styles.profile}>
      <TouchableOpacity
        style={{ alignSelf: "flex-start" }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-circle-sharp"
          color={Color.primaryColor}
          size={height(4)}
        />
      </TouchableOpacity>
      <Image
        source={{
          uri:
            user?.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.image}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.contact}>{user?.branchIds[0]}</Text>
        <Text style={styles.username}>{user?.username}</Text>

        {/* <Text style={styles.email}>{user?.email}</Text> */}
        {/* <Text style={styles.contact}>{user?.phoneNumber}</Text> */}
        <View
          style={{
            backgroundColor: Color.backgroundColor,

            paddingVertical: height(0.5),
            borderRadius: height(2),
            flexDirection: "row",
          }}
        >
          <Ionicons
            name="location-sharp"
            color={Color.primaryColor}
            size={height(2)}
            style={{ paddingHorizontal: height(1) }}
          />
          <Text style={styles.address}>{user?.address}</Text>
        </View>
      </View>
      <View
        style={{
          marginLeft: "auto",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            GlobalMethods.onPressCall(user?.phoneNumber);
          }}
        >
          <Ionicons name="call" size={20} color={Color.white} />
        </TouchableOpacity>
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
          <Ionicons name="chatbubbles-sharp" size={20} color={Color.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      headerUnScrollable={headerItem}
      footerUnScrollable={() => {
        return order?.totalQuantity ? (
          <TouchableOpacity onPress={() => handleOrder()}>
            <View style={styles.floatingButton}>
              <Text style={styles.floatingText}> {order?.totalQuantity}</Text>
              <Text style={styles.floatingText}> Make Order</Text>
              <Text style={styles.floatingText}>Rs: {order?.totalAmount}</Text>
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
          ListHeaderComponent={
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Products</Text>
              </View>
              <Header
                searchText={searchText}
                setSearchText={setSearchText}
                selectValue={selectValue}
                SetSelectValue={SetSelectValue}
                categories={d}
                showTopHead={false}
              />
            </>
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.noItemsText}>No items available</Text>
          }
          numColumns={2}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
    alignItems: "center",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    margin: height(1),
    backgroundColor: "white",
    padding: height(1),
    borderRadius: height(2),
  },
  profileInfo: {
    marginLeft: height(1),
    maxWidth: width(53),
  },
  username: {
    fontSize: height(2),
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  contact: {
    fontSize: height(2.5),
    color: Color.primaryColor,
    fontWeight: "700",
    fontStyle: "italic",
  },
  address: {
    fontSize: height(1.5),
    color: "#666",
    fontWeight: "700",
  },
  editButton: {
    backgroundColor: Color.primaryColor,
    padding: height(1),
    margin: height(0.5),
    borderRadius: height(5),
  },
  sectionHeader: {
    paddingHorizontal: height(2),
    backgroundColor: "white",
    borderTopLeftRadius: height(3),
    borderTopRightRadius: height(3),
    width: width(99),
  },
  sectionTitle: {
    fontSize: height(2.5),
    fontWeight: "bold",
    paddingVertical: height(1),
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
    marginBottom: height(1),
  },
  floatingText: {
    color: Color.colorWhite,
    fontWeight: "bold",
  },
  image: {
    width: height(8),
    height: height(8),
    alignSelf: "center",
    marginVertical: height(2),
    borderWidth: height(0.3),
    borderColor: Color.backgroundColor,
    borderRadius: height(20),
  },
});

export default ContactProfileScreen;
