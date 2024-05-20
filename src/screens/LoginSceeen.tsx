import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Color, FontFamily, FontSize } from "../utills/GlobalStyles";
import HeadereImages from "../components/HeadereImages";
import { useTranslation } from "react-i18next";
import { useFirebaseLogin } from "@itzsunny/firebase-login";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  const auth = getAuth();
  const app = getApp();
  const { recaptcha, recaptchaBanner, sendOtp } = useFirebaseLogin({
    auth: auth,
    firebaseConfig: app.options,
  });

  const handleSendOTP = async () => {
    const phoneNumberRegex = /^(\+92|92|0)-?3\d{2}-?\d{7}$/;

    if (!phoneNumberRegex.test(phoneNumber)) {
      Alert.alert(
        t("login.invalid_phone_number"),
        t("login.valid_phone_number"),
      );
      return;
    }
    setLoading(true);

    try {
      console.log("()=> handleSendOTP");
      const verificationId = await sendOtp(phoneNumber);
      console.log("confirmationResult.");
      console.log(verificationId);
      navigation.navigate("OtpVerification", {
        phoneNumber,
        verificationId: verificationId,
      });
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeadereImages />
      <View style={styles.imageContainer}>
        <Image
          style={styles.undrawSecureLoginPdn41Icon}
          source={require("../assets/images/forgotPasswordIconn.png")}
        />
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.enterYourEmail}>
          {t("login.enter_mobile_number")}
        </Text>
        <Text style={styles.sendYou}>{t("login.confirmation_message")}</Text>
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
          <Text style={styles.sendOtp}>{t("login.send_otp")}</Text>
        </TouchableOpacity>
      </View>
      {recaptcha}
      {recaptchaBanner}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Color.primaryColor} />
        </View>
      )}
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
    overflow: "hidden",
    width: "100%",
    resizeMode: "contain",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
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
    borderColor: Color.primaryColor,
    borderWidth: 2,
    height: 55,
    paddingHorizontal: 10,
  },
  rectangleViewBorder: {
    borderColor: Color.primaryColor,
    borderStyle: "solid",
    borderRadius: 10,
    backgroundColor: Color.primaryColor,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
