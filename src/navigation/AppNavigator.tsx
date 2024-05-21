import * as React from "react";
import { connect } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginSceeen";
import OtpVerification from "../screens/OtpVerification";
import MainStack from "./MainStack";
import { RootState } from "../redux/store";
import EditItemScreen from "../screens/EditItemScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="MainStack"
            component={MainStack}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditItemScreen"
            component={EditItemScreen}
            options={{ headerShown: false }}
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
