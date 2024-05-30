import * as React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "../screens/UserScreen";
import SettingScreen from "../screens/SettingScreen";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Color } from "../utills/GlobalStyles";
import ProfileScreen from "../screens/ProfileScreen";
import BillScreen from "../screens/BillScreen";
import ProductsScreen from "../screens/ProductsScreen";
import ChatList from "../screens/ChatList";

const Tab = createBottomTabNavigator();
const MainStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Color.primaryColor,
      }}
    >
      <Tab.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          tabBarLabel: "user",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="chatListScreen"
        component={ChatList}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProductsScreen"
        component={ProductsScreen}
        options={{
          tabBarLabel: "Products",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BillScreen"
        component={BillScreen}
        options={{
          tabBarLabel: "Bill",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="table" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreem"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" color={color} size={size} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};
export default MainStack;
