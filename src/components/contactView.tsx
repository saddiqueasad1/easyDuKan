import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { height, width } from "../utills/Dimension";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "../utills/GlobalStyles";
import GlobalMethods from "../utills/GlobalMethods";

type UserProfileProps = {
  data: {
    name: string;
    username: string;
    phoneNumber: string;
    imageUrl: string;
    userId: string;
  };
};

const ContactView: React.FC<UserProfileProps> = ({ data }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ContactProfileScreen", { userId: data.userId });
      }}
      style={styles.container}
    >
      <Image
        source={{
          uri:
            data.imageUrl ||
            "https://w7.pngwing.com/pngs/357/22/png-transparent-testimonial-computer-icons-customer-business-customer-blue-company-text-thumbnail.png",
        }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{data.username}</Text>
        <Text style={styles.phone}>{data.phoneNumber}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            GlobalMethods.onPressCall(data?.phoneNumber);
          }}
        >
          <Ionicons name="call" size={20} color={Color.grey} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            // const new_user = { ...user, userId };
            // console.log(new_user);
            // navigation.navigate("ChatScreen", {
            //   usr: new_user,
            //   userRoom: user?.roomId,
            // });
          }}
        >
          <Ionicons name="chatbubbles-sharp" size={20} color={Color.grey} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    marginHorizontal: height(1),
    marginVertical: height(0.51),
    padding: height(1),
    borderRadius: height(1),
    backgroundColor: Color.backgroundColor,
  },
  image: {
    width: height(6),
    height: height(6),
    marginRight: 10,
    borderRadius: height(10),
  },
  textContainer: {
    width: width(50),
  },
  iconContainer: {
    width: width(20),
    marginLeft: "auto",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  text: {
    fontSize: height(2),
    fontWeight: "bold",
  },
  phone: {
    fontSize: height(1.8),
    fontWeight: "400",
  },
});

export default ContactView;
