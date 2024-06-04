import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Color as AppColors } from "../utills/GlobalStyles";
import { height, width } from "../utills/Dimension";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getAuth, signOut } from "firebase/auth";
import { clearUser } from "../redux/slices/userSlice";
const CustomDrawer = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user);
  const profile = useSelector((state: RootState) => state.profile);
  const { username, email, address } = profile;
  const [phoneNumber] = useState(user?.phoneNumber + "");
  const dispatch = useDispatch();
  const styles = getStyles(AppColors);
  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };
  const logout = async () => {
    const auth = getAuth();
    await signOut(auth)
      .then(() => {
        dispatch(clearUser());
        console.log("logout");
      })
      .catch((error) => {
        console.log("ertyuiop", error);
      });
  };
  const addIProduct = async () => {
    navigation.navigate("EditProductScreen", {
      userId: user?.uid,
    });
  };
  const viewAllProducts = async () => {
    navigation.navigate("ProfileScreem");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: AppColors.primaryColor,
          paddingVertical: height(2),
          borderBottomRightRadius: height(3),
          borderBottomLeftRadius: height(3),
        }}
      >
        <Image
          source={{
            uri:
              profile?.Image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.image}
        />
        <View style={styles.profile}>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.contact}>{phoneNumber}</Text>
            <Text style={styles.address}>{address}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <FontAwesome5 name="edit" size={20} color={AppColors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginVertical: height(1) }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AddCategoryScreen");
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text style={styles.dbtext}>All Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            viewAllProducts();
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text style={styles.dbtext}>All Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            addIProduct();
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text style={styles.dbtext}>Add new product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DailyReportScreen");
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text style={styles.dbtext}>Reposrt & Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("BillScreen");

            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text style={styles.dbtext}>All Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate("myhorder");

            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text style={styles.dbtext}>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            logout();
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text style={[styles.dbtext, { color: "red" }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
// E5E8E8
export default CustomDrawer;

const getStyles = (AppColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      margin: width(2),
      marginLeft: -width(3),
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      justifyContent: "flex-start",
    },
    image: {
      width: height(15),
      height: height(15),
      alignSelf: "center",
      marginVertical: height(2),
      borderWidth: height(0.3),
      borderColor: "white",
      borderRadius: height(20),
    },
    dbtext: {
      fontSize: height(1.6),
      fontWeight: "500",
    },
    icon: {
      color: "white",
      marginHorizontal: width(1),
    },
    text: {
      fontSize: height(1.8),
    },
    textbuttom: {
      alignSelf: "center",
      fontSize: height(1.5),
      color: AppColors.black,
    },
    bottomview: {
      marginTop: height(5),
      maxWidth: width(60),
      justifyContent: "flex-end",
      alignContent: "flex-end",
      alignItems: "flex-end",
    },
    profile: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileInfo: {
      marginLeft: 20,
    },
    username: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
      color: AppColors.white,
    },
    email: {
      fontSize: 16,
      color: "#666",
      marginBottom: 5,
      color: AppColors.white,
    },
    contact: {
      fontSize: 16,
      color: "#666",
      marginBottom: 5,
      color: AppColors.white,
    },
    address: {
      fontSize: 16,
      color: "#666",
      color: AppColors.white,
    },
    editButton: {
      marginLeft: "auto",
      marginRight: width(5),
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
    drawrbtn: {
      padding: height(2),
      backgroundColor: "#EBEBED",
      marginVertical: height(0.5),
      marginHorizontal: height(1),
      borderRadius: height(3),
    },
  });
