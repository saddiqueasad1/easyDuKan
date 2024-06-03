import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { height, width } from "../utills/Dimension";
import { useNavigation } from "@react-navigation/native";
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
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA-MNSjK1KQq5QyX3QxBm3y20qUxhJVWvRmQ&usqp=CAU",
        }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{data.username}</Text>
        <Text style={styles.text}>{data.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    margin: height(1),
    width: width(100),
  },
  image: {
    width: height(8),
    height: height(8),
    marginRight: 10,
    borderRadius: height(10),
  },
  textContainer: {
    flexDirection: "column",
    width: width(90),
  },
  text: {
    fontSize: height(2),
  },
});

export default ContactView;
