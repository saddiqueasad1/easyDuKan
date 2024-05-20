import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Color } from "../utills/GlobalStyles";
import HeadereImages from "../components/HeadereImages";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const SettingScreen = () => {
  const user = useSelector((state: RootState) => state.user);
  return (
    <View style={styles.container}>
      <HeadereImages />
      <Text>User Profile</Text>
      <Text>User Profile</Text>
      <Text>User Profile</Text>
      <Text>User Profile</Text>
      <Text>{user?.phoneNumber}</Text>
      <Text>{user.uid}</Text>

      <Button title="Login" />
      <Button title="Logout" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
});

export default SettingScreen;
