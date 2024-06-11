import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AppNavigator from "./navigation/AppNavigator";
import i18n from "./locales/Translation";
import { useState } from "react";
import { I18nextProvider } from "react-i18next";
import { app } from "./utills/firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { setProfile } from "./redux/slices/profilleSlice";
import Loader from "./components/Loder";

const App = () => {
  const [hideSplashScreen] = useState(true);
  const db = getFirestore();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [fontsLoaded, error] = useFonts({
    "Outfit-Regular": require("./assets/fonts/Outfit-Regular.ttf"),
    "Outfit-SemiBold": require("./assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("./assets/fonts/Outfit-Bold.ttf"),
  });

  React.useEffect(() => {
    console.log(app.automaticDataCollectionEnabled);
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const newData = { ...data, userId: user.uid };
          console.log("log of user data", newData,data);

          dispatch(setProfile(newData as any));
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (!!user.uid) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid, db]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Loader />
        {hideSplashScreen ? <AppNavigator /> : null}
      </NavigationContainer>
    </I18nextProvider>
  );
};
export default App;
