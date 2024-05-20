import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AppNavigator from "./navigation/AppNavigator";
import i18n from "./locales/Translation";
import { useState } from "react";
import { I18nextProvider } from "react-i18next";

const App = () => {
  const [hideSplashScreen] = useState(true);

  const [fontsLoaded, error] = useFonts({
    "Outfit-Regular": require("./assets/fonts/Outfit-Regular.ttf"),
    "Outfit-SemiBold": require("./assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("./assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        {hideSplashScreen ? <AppNavigator /> : null}
      </NavigationContainer>
    </I18nextProvider>
  );
};
export default App;
