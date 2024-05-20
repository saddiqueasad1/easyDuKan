import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
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

  console.log(verificationId, "Verification :phoneNumber", phoneNumber);

  const [oTP, setOtP] = React.useState("");
  const { t } = useTranslation();
  const auth = getAuth();

  const firebaseOTPVerification = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, oTP);
      await signInWithCredential(auth, credential)
        .then((res) => {
          console.log("res of ()=> firebaseOTPVerification");
          // {"_redirectEventId": undefined, "apiKey": "AIzaSyBfTQ7IigRYXnp0DExoeutidqdN2xfljM0", "appName": "[DEFAULT]", "createdAt": "1709215100260", "displayName": undefined, "email": undefined, "emailVerified": false, "isAnonymous": false, "lastLoginAt": "1709215100261", "phoneNumber": "+923115182891", "photoURL": undefined, "providerData": [[Object]], "stsTokenManager": {"accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiYjg3ZGNhM2JjYjY5ZDcyYjZjYmExYjU5YjMzY2M1MjI5N2NhOGQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZGhhcnRpLWE3MmJkIiwiYXVkIjoiZGhhcnRpLWE3MmJkIiwiYXV0aF90aW1lIjoxNzA5MjE1MTAwLCJ1c2VyX2lkIjoiVHlIWFhpNHFxRVhvbUY2ajYwMGZESUd3UHBqMSIsInN1YiI6IlR5SFhYaTRxcUVYb21GNmo2MDBmRElHd1BwajEiLCJpYXQiOjE3MDkyMTUxMDAsImV4cCI6MTcwOTIxODcwMCwicGhvbmVfbnVtYmVyIjoiKzkyMzExNTE4Mjg5MSIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzkyMzExNTE4Mjg5MSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.ikdmvWhBhf6mqn-elafWPLxysHMleLVGI__I4wtrc1kL9mJ2vWuJysknWA3YQOhEjD6LhCkulJWEJvNHAogqsDAvuP_1mg-7YpxoCQgwRZTPrE0BuAAcV9x2au-C0cKyv3YLU3K_Bl8j5qWbIDkS-8Deuj2cUU4A7TH5HyH9R6_PORVCWHQscX2qpOtAkR3NkVL2iAfU8hbR9JKIvAa1w6Ci6aA125bMrprXJGjN9yjouknkDJrjtOHGFKgUDm4McReGv3fJwaqAlUtIqJyZzVRgoHedn2ZEZNAGJlMpHcbNaa8OanQwpjKPGFlIdl2GOdxoap2WfOqZsLMvk40MSw", "expirationTime": 1709218700412, "refreshToken": "AMf-vBwj_5RwgPkPFYtPI68eIlsWg8DnhstKpRIHgny240VwoGqnptOv81i2ep4DfKCeyUhRKiGZh3tCl_3N9mikCWBY2-HLcUlidY1_Dk6EtT9CmQfBFaIIL0HQIQd2tH1MDG7Hb3-o7JSYjJfzj8BMepkA_rQBT2OIjrtYcSnWtXPgWTOV3jGoD62sei1W8nKWcKbyV99M"}, "tenantId": undefined, "uid": "TyHXXi4qqEXomF6j600fDIGwPpj1"}
          console.log(res.user);
          // finishFirebaseOTPVerification(res.user.uid);
          navigation.navigate("MainStack");
        })
        .catch((err) => alert(err.message));
    } catch (err) {
      navigation.goBack();
      console.log(err);
    } finally {
      // setVerifying(false);
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
          {t("OtpVerification.enter_Code")}
        </Text>
        <Text style={styles.sendYou}>
          {t("OtpVerification.automatically_Detecting")}
        </Text>
        <TextInput
          style={styles.inputNumber}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={oTP}
          onChangeText={setOtP}
        />
        <TouchableOpacity
          style={styles.rectangleViewBorder}
          onPress={firebaseOTPVerification}
        >
          <Text style={styles.sendOtp}>{t("OtpVerification.submit")}</Text>
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
});

export default OtpVerification;
