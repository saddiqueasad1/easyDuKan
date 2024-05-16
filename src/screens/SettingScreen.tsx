import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Color } from "../utills/GlobalStyles";
import HeadereImages from "../components/HeadereImages";

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <HeadereImages />
      <Text>setting..........................</Text>
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
