import React, { useContext } from "react";
import { Image, View } from "react-native";
import Modal from "react-native-modal";
import { Color as AppColors } from "../utills/GlobalStyles";
export default function Loader() {
  const appLoader = useSelector(selectAppLoader);
  //   const { AppColors } = useContext(ThemeContext);
  const styles = getStyles(AppColors);
  return (
    <Modal
    animationIn='bounceIn'
    animationOut={'bounceOut'}
    animationInTiming={1000}
    animationInTiming={3000}
    isVisible={appLoader} backdropOpacity={1} backdropColor={"white"}>
      <View style={styles.container}>
        <Image
          style={{
            width: width(30),
            height: width(30),
            borderRadius: width(10),
          }}
          source={Icons.loder}
        />
      </View>
    </Modal>
  );
}
import { StyleSheet } from "react-native";
import { width } from "../utills/Dimension";
import Icons from "../assets/images";
import { Color } from "../utills/GlobalStyles";
import { selectAppLoader } from "../redux/slices/loaderSlice";
import { useSelector } from "react-redux";
const getStyles = (AppColors) =>
  StyleSheet.create({
    container: {
      width: width(30),
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      borderRadius: width(10),
      flexDirection: "row",
    },
    text: {
      color: AppColors.black,
      fontSize: width(3.2),
      marginLeft: width(2),
      fontWeight: "bold",
    },
    image: { width: width(20), height: width(20), borderRadius: width(10) },
  });
