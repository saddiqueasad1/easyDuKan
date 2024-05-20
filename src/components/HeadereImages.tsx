import React from "react";
import { Image } from "react-native";
import { StyleSheet } from "react-native";

const HeadereImages = () => {
  return (
    <>
      <Image
        style={[styles.loginChild, styles.layout]}
        contentFit="cover"
        source={require("../assets/images/ellipse-66.png")}
      />
      <Image
        style={[styles.loginItem, styles.layout]}
        contentFit="cover"
        source={require("../assets/images/ellipse-67.png")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  layout: {
    height: 407,
    width: 407,
    position: "absolute",
  },
  loginChild: {
    top: -130,
    left: 87,
  },
  loginItem: {
    top: -95,
    left: -68,
  },
});

export default HeadereImages;
