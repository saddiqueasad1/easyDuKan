import * as React from "react";
import { connect } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginSceeen";
import OtpVerification from "../screens/OtpVerification";
import MainStack from "./MainStack";
import { RootState } from "../redux/store";
import EditItemScreen from "../screens/EditItemScreen";
import AddCategoryScreen from "../screens/AddCategoryScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

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
            name="EditItemScreen"
            component={EditItemScreen}
            options={{ headerShown: true, title: "Edit Item" }}
          />
          <Stack.Screen
            name="AddCategoryScreen"
            component={AddCategoryScreen}
            options={{ headerShown: true, title: "Edit Item" }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{ headerShown: true, title: "Edit Profile" }}
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
