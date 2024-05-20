import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Color, FontFamily, FontSize } from "../utills/GlobalStyles";
import HeadereImages from "../components/HeadereImages";
import { useTranslation } from "react-i18next";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { RouteProp } from "@react-navigation/native";
import OtpInputBox from "../components/OtpInputBox";

type RootStackParamList = {
  OtpVerification: {
    phoneNumber: string;
    verificationId: string;
  };
};

type OtpVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  "OtpVerification"
>;

const OtpVerification = ({
  navigation,
  route,
}: {
  navigation: any;
  route: OtpVerificationScreenRouteProp;
}) => {
  const phoneNumber = route.params.phoneNumber;
  const verificationId = route.params.verificationId;
  const [isOtpFilled, setIsOtpFilled] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const [oTP, setOtP] = React.useState("");
  const { t } = useTranslation();
  const auth = getAuth();

  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  const firebaseOTPVerification = async () => {
    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, oTP);
      await signInWithCredential(auth, credential)
        .then((res) => {
          console.log("res of ()=> firebaseOTPVerification", phoneNumber);
          console.log(res.user);
          setShowSuccess(true);
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              navigation.navigate("MainStack");
            }, 2000);
          });
        })
        .catch((err) => alert(err.message));
    } catch (err) {
      navigation.goBack();
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpFilled = (filled: string) => {
    setOtP(filled);
    setIsOtpFilled(filled.length === 6);
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
          {t("OtpVerification.enter_Code")}
        </Text>
        <Text style={styles.sendYou}>
          {t("OtpVerification.automatically_Detecting")}
        </Text>
        <OtpInputBox length={6} onOtpChange={handleOtpFilled} />
        <TouchableOpacity
          style={
            isOtpFilled
              ? styles.rectangleViewBorder
              : [styles.rectangleViewBorder, styles.disabledButton]
          }
          onPress={firebaseOTPVerification}
          disabled={!isOtpFilled}
        >
          <Text style={styles.sendOtp}>{t("OtpVerification.submit")}</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Color.primaryColor} />
        </View>
      )}
      {showSuccess && (
        <Animated.View
          style={[
            styles.successContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            style={styles.successImage}
            source={require("../assets/images/successfullyLogin.jpeg")}
          />
        </Animated.View>
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
  disabledButton: {
    backgroundColor: "#ccc",
    borderColor: "#ccc",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  successImage: {
    width: 500,
    height: 500,
    resizeMode: "contain",
  },
});

export default OtpVerification;
