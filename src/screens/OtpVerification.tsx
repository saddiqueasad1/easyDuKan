import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Color, FontFamily, FontSize } from "../utills/GlobalStyles";
import HeadereImages from "../components/HeadereImages";

const OtpVerification = () => {
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const handleSendOTP = () => {
    const phoneNumberRegex = /^(\+92|92|0)-?3\d{2}-?\d{7}$/;

    if (!phoneNumberRegex.test(phoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid Pakistani phone number.",
      );
      return;
    }
    Alert.alert(" ✅ ✅ valid Phone Number", "OTP sent, check your phone");
  };

  return (
    <View style={styles.container}>
      <HeadereImages />
      <View style={{ padding: 10, marginTop: 200 }}>
        <Image
          style={styles.undrawSecureLoginPdn41Icon}
          source={require("../assets/images/undraw-secure-login-pdn4-1.png")}
        />
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.enterYourEmail}>{`Enter Verification Code`}</Text>
        <Text
          style={styles.sendYou}
        >{`We Are Automatically detecting a SMS Sent to your Number`}</Text>
        <TextInput
          style={styles.inputNumber}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TouchableOpacity
          style={styles.rectangleViewBorder}
          onPress={handleSendOTP}
        >
          <Text style={styles.sendOtp}>Submit</Text>
        </TouchableOpacity>
      </View>
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
  undrawSecureLoginPdn41Icon: {
    height: 223,
    left: 26,
    overflow: "hidden",
    width: 321,
  },
  innerContainer: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 30,
    gap: 20,
  },
  inputNumber: {
    borderStyle: "solid",
    borderRadius: 10,
    borderColor: Color.colorDarkslateblue,
    borderWidth: 2,
    height: 55,
    paddingHorizontal: 10,
  },
  rectangleViewBorder: {
    borderColor: Color.colorDarkslateblue,
    borderStyle: "solid",
    borderRadius: 10,
    backgroundColor: Color.colorDarkslateblue,
    borderWidth: 1,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  enterYourEmail: {
    color: "#000",
    fontFamily: FontFamily.outfitRegular,
    fontSize: FontSize.size_mini,
    textAlign: "center",
  },
  sendYou: {
    textAlign: "center",
  },
  sendOtp: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FontFamily.outfitBold,
    color: Color.colorWhite,
  },
});

export default OtpVerification;
