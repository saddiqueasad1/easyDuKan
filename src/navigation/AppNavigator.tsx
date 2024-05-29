import * as React from "react";
import { connect } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginSceeen";
import OtpVerification from "../screens/OtpVerification";
import MainStack from "./MainStack";
import { RootState } from "../redux/store";
import EditProductScreen from "../screens/EditProductScreen";
import AddCategoryScreen from "../screens/AddCategoryScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
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
            options={{ headerShown: true, title: "Chat" }}
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
