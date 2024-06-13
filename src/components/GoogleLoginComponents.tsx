import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { Color, FontFamily } from "../utills/GlobalStyles";
import { useTranslation } from "react-i18next";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/slices/profilleSlice";
import { setUser } from "../redux/slices/userSlice";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginComponents({
  setLoading = true,
}: {
  setLoading: any;
}) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "777069971997-0kkvncld2jhkurqcp5qp5l3v993ef03f.apps.googleusercontent.com",
    iosClientId:
      "777069971997-n7ftkicfcqecjav02lmjas9hclaai48b.apps.googleusercontent.com",
  });

  const auth = getAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const db = getFirestore();

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      const id_token = authentication?.idToken;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const username = user.displayName || "";
          const phoneNumber = user.phoneNumber || "";
          const email = user.email || "";
          const address = "";
          const emailVerified = user.emailVerified;
          const photoURL = user.photoURL || "";
          const userRef = doc(db, "users", user.uid);
          const docSnapshot = await getDoc(userRef);
          if (!docSnapshot.exists()) {
            await setDoc(doc(db, "users", user.uid), {
              username,
              phoneNumber,
              email,
              address,
              emailVerified,
              photoURL,
            });
            dispatch(
              setProfile({
                username,
                phoneNumber,
                email,
                address,
                userId: user.uid,
                emailVerified,
                photoURL,
                branchIds: [],
                selectedBranchId: "",
              }),
            );
            dispatch(setUser({ uid: user.uid, isProfileComplete: false }));
          } else {
            dispatch(setUser({ uid: user.uid, isProfileComplete: true }));
          }
        })
        .catch((error) => {
          console.error("Error signing in with Google:", error);
        })
        .finally(() => {
          setLoading(false);
        });

      // Handle successful authentication here
    } else {
      setLoading(false);
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.rectangleViewBorder}
      onPress={() => {
        setLoading(true);
        promptAsync();
      }}
    >
      <Text style={styles.sendOtp}>{t("login.login_with_google")}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  sendOtp: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FontFamily.outfitBold,
    color: Color.colorWhite,
  },
  rectangleViewBorder: {
    borderStyle: "solid",
    borderRadius: 10,
    backgroundColor: "#6c9418",
    borderWidth: 1,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
});
