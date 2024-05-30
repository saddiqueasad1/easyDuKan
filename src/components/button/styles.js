import { Platform, StyleSheet } from "react-native";
import { height, width } from "../../utills/Dimension";

const getStyles = (AppColors) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: width(25),
      backgroundColor: AppColors.primary,
      width: width(85),
      alignSelf: "center",
      paddingVertical: height(1.8),
      ...Platform.select({
        ios: {
          shadowColor: AppColors.black,
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    text: {
      color: 'white',
      fontSize: height(1.8),
      fontWeight: "bold",
    },
  });
export default getStyles;
