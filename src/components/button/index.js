import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import getStyles from "./styles";
// import { ThemeContext } from "../../theme";
import { Color as AppColors } from "../../utills/GlobalStyles";
const Button = ({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  loaderColor = "white",
  activeOpacity = 0.7,
  containerStyle = {},
  textStyle = {},
}) => {
  const { t } = useTranslation();
  // const { AppColors } = useContext(ThemeContext);
  const styles = getStyles(AppColors);
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={activeOpacity}
      style={[styles.container, containerStyle]}
    >
      {isLoading ? (
        <ActivityIndicator color={loaderColor} size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{t(title)}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
