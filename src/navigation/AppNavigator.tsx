import * as React from "react";
import { connect, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginSceeen";
import OtpVerification from "../screens/OtpVerification";
import MainStack from "./MainStack";
import { RootState } from "../redux/store";
import EditProductScreen from "../screens/EditProductScreen";
import AddCategoryScreen from "../screens/AddCategoryScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import BillingDetailScreen from "../screens/BillingDetailScreen";
import { AppState } from "react-native";
import { getDatabase, ref, set } from "firebase/database";
import ContactProfileScreen from "../screens/ContactStore";
import DailyReportScreen from "../screens/DailyReportScreen";
const Stack = createNativeStackNavigator();

const AppNavigator = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const loginuser = useSelector((state: RootState) => state.user);
  const db = getDatabase();
  const appState = React.useRef(AppState.currentState);
  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
      console.log("AppState in app", appState?.current);
      if (nextAppState === "active" || appState?.current === "active") {
        setTimeout(() => {
          fetchOlineStatus(true);
        }, 1000);
      } else {
        fetchOlineStatus(false);
      }
    });

    return () => {
      subscription.remove();
    };
  });
  React.useEffect(() => {
    fetchOlineStatus(true);
  }, [loginuser]);
  async function fetchOlineStatus(check: any) {
    try {
      if (loginuser) {
        let a = loginuser?.uid;
        const userStatusRef = ref(db, `users/${a}/online`);
        await set(userStatusRef, check);
      }
    } catch (error) {}
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="MainStack"
            component={MainStack}
            options={{ headerShown: false, title: "" }}
          />
          <Stack.Screen
            name="EditProductScreen"
            component={EditProductScreen}
            options={{ headerShown: true, title: "Edit Item" }}
          />
          <Stack.Screen
            name="AddCategoryScreen"
            component={AddCategoryScreen}
            options={{ headerShown: true, title: "Add Category" }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{ headerShown: true, title: "Edit Profile" }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BillingDetailScreen"
            component={BillingDetailScreen}
            options={{ headerShown: true, title: "Billing Detail" }}
          />
          <Stack.Screen
            name="ContactProfileScreen"
            component={ContactProfileScreen}
            options={{ headerShown: true, title: "User Profile" }}
          />
          <Stack.Screen
            name="DailyReportScreen"
            component={DailyReportScreen}
            options={{ headerShown: true, title: "Daily Report" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OtpVerification"
            component={OtpVerification}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: RootState) => ({
  isLoggedIn: !!state.user.uid, // Assuming user slice contains isLoggedIn state
});

export default connect(mapStateToProps)(AppNavigator);
