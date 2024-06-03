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
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
const CustomDrawer = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user);
  const profile = useSelector((state: RootState) => state.profile);
  const { username, email, address } = profile;
  const [phoneNumber] = useState(user?.phoneNumber + "");

  const styles = getStyles(AppColors);
  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: AppColors.primaryColor,
          paddingVertical: height(2),
        }}
      >
        <Image
          source={{
            uri:
              profile?.Image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={{
            width: height(10),
            height: height(10),
            alignSelf: "center",
            marginVertical: height(5),
          }}
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
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text>All Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text>All Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text>Add new product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            
            navigation.closeDrawer();
          }}
          style={styles.drawrbtn}
        >
          <Text>Log Out</Text>
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
      borderRadius: height(1),
    },
  });
