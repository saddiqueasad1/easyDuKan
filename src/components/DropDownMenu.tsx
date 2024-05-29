import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { height, width } from "../utills/Dimension";

// import { ThemeContext } from "../../theme";
import { Color as AppColors } from "../utills/GlobalStyles";
// import SmallText from "../text";
const DropDownMenu = ({
  isVisible = false,
  onClose = () => {},
  onPressFirstBtn = () => {},
  onPressSecondBtn = () => {},
  firstBtnText = "",
  secondBtnText = "",
  thirdText = "",
  onPressThirdBtn = () => {},
}) => {
  const { t } = useTranslation();
//   const { AppColors } = useContext(ThemeContext);
  const styles = getStyles(AppColors);
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeInUpBig"
      animationInTiming={1000}
      backdropColor={AppColors.black}
    >
      <View style={styles.modalContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.button}
            onPress={onPressFirstBtn}
          >
            <SmallText color={AppColors.DDTColor}>{firstBtnText}</SmallText>
          </TouchableOpacity>

          {secondBtnText && <View style={styles.line} />}
          {secondBtnText && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={onPressSecondBtn}
            >
              <SmallText color={AppColors.DDTColor}>{secondBtnText}</SmallText>
            </TouchableOpacity>
          )}

          {thirdText !== "" && (
            <>
              <View style={styles.line} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.button}
                onPress={onPressThirdBtn}
              >
                <SmallText>{thirdText}</SmallText>
              </TouchableOpacity>
            </>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cancelBtn}
          onPress={onClose}
        >
          <SmallText color={AppColors.primary}>{t("chat.cancel")}</SmallText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
export default DropDownMenu;

import { StyleSheet } from "react-native";

const getStyles = (AppColors) =>
  StyleSheet.create({
    modalContainer: {
      alignSelf: "center",
      bottom: height(1),
      position: "absolute",
    },
    buttonContainer: {
      borderRadius: width(4),
      backgroundColor: AppColors.white,
      width: width(85),
      justifyContent: "space-evenly",
    },
    button: {
      margin: height(2),
      width: "100%",
      alignSelf: "center",
      alignItems: "center",
    },

    cancelBtn: {
      marginTop: height(1.5),
      alignSelf: "center",
      width: width(85),
      height: height(6),
      justifyContent: "center",
      borderRadius: width(4),
      backgroundColor: AppColors.white,
      alignItems: "center",
    },
    btnText: {
      textAlign: "center",
      fontSize: height(2),
      color: AppColors.black,
    },
    line: {
      width: "100%",
      alignSelf: "center",
      backgroundColor: AppColors.black,
      height: 0.5,
    },
  });
  const  SmallText = ({
    children = "",
    size = 2,
    textAlign,
    color = AppColors.black,
    textStyles,
    textProps,
    onPress = undefined,
  }) => {
    const styles = StyleSheet.create({
      text: {
        fontSize: height(size),
        color: color,
        textAlign: textAlign,
        fontWeight: "500",
      },
    });
    return (
      <Pressable disabled={typeof onPress == "undefined"} onPress={onPress}>
        <Text style={[styles.text, textStyles]} {...textProps}>
          {children}
        </Text>
      </Pressable>
    );
  };