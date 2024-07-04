import * as React from "react";
import { connect, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation, CommonActions } from "@react-navigation/native";
import LoginScreen from "../screens/LoginSceeen";
import OtpVerification from "../screens/OtpVerification";
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
import MyDrawer from "./Drawr";
import ProfileScreen from "../screens/ProfileScreen";
import BillScreen from "../screens/BillScreen";
import ChatList from "../screens/ChatList";
import AddProfileScreen from "../screens/AddProfileScreen";
import MyOrdersScreen from "../screens/MyOrders";
const Stack = createNativeStackNavigator();

const AppNavigator = ({
  isLoggedIn,
  isProfile,
}: {
  isLoggedIn: boolean;
  isProfile: boolean;
}) => {
  const loginuser = useSelector((state: RootState) => state.user);
  const db = getDatabase();
  const appState = React.useRef(AppState.currentState);
  const navigation = useNavigation();

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

  React.useEffect(() => {
    if (isLoggedIn && isProfile) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "drawr" }],
        }),
      );
    }
  }, [isLoggedIn, isProfile]);

  async function fetchOlineStatus(check: any) {
    try {
      if (loginuser) {
        let a = loginuser?.uid;
        const userStatusRef = ref(db, `users/${a}/online`);
        await set(userStatusRef, check);
      }
    } catch (error) {
      console.error("Error updating online status", error);
    }
  }

  console.log("!!isLoggedIn. ", isLoggedIn);
  console.log("!!profile. ", isProfile);

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          !isProfile ? (
            <Stack.Screen
              name="AddProfileScreen"
              component={AddProfileScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="drawr"
                component={MyDrawer}
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
                options={{ headerShown: true, title: "Categories" }}
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
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DailyReportScreen"
                component={DailyReportScreen}
                options={{ headerShown: true, title: "Daily Report" }}
              />
              <Stack.Screen
                name="ProfileScreem"
                component={ProfileScreen}
                options={{ headerShown: true, title: "All Products" }}
              />
              <Stack.Screen
                name="BillScreen"
                component={BillScreen}
                options={{ headerShown: true, title: "All Bill" }}
              />
              <Stack.Screen
                name="chatListScreen"
                component={ChatList}
                options={{ headerShown: true, title: "Chats" }}
              />
                <Stack.Screen
                name="MyOrderScreen"
                component={MyOrdersScreen}
                options={{ headerShown: false }}
              />
            </>
          )
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
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isLoggedIn: !!state.user.uid,
  isProfile: state.user.isProfileComplete,
});

export default connect(mapStateToProps)(AppNavigator);
