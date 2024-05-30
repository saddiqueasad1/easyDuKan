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
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
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
    width: width(90),
  },
  image: {
    width: height(8),
    height: height(8),
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
  },
  text: {
    fontSize: height(2),
  },
});

export default ContactView;
