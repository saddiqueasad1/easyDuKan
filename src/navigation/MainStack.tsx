import * as React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "../screens/UserScreen";
import SettingScreen from "../screens/SettingScreen";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Color } from "../utills/GlobalStyles";
import ProfileScreen from "../screens/ProfileScreen";
import BillScreen from "../screens/BillScreen";
import ProductsScreen from "../screens/ProductsScreen";
import ChatList from "../screens/ChatList";
import { height, width } from "../utills/Dimension";
import { View } from "react-native";

const Tab = createBottomTabNavigator();
const MainStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Color.primaryColor,
        tabBarStyle:{
          height:height(7),
          paddingBottom:height(1),
        }
      }}
    >
      <Tab.Screen
        name="ProductsScreen"
        component={ProductsScreen}
        options={{
          tabBarLabel: "My stocks",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#D1FFBD" : "white",
                  paddingHorizontal: width(5),
                borderRadius: width(5),
                paddingVertical: width(0.5),
              }}
            >
              <MaterialIcons
                name="add"
                color={color}
               size={height(2.5)}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          tabBarLabel: "contants",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#D1FFBD" : "white",
                  paddingHorizontal: width(5),
                borderRadius: width(5),
                paddingVertical: width(0.5),
              }}
            >
              <AntDesign
                name="contacts"
                color={color}
               size={height(2.5)}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="chatListScreen"
        component={ChatList}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#D1FFBD" : "white",
                  paddingHorizontal: width(5),
                borderRadius: width(5),
                paddingVertical: width(0.5),
              }}
            >
              <Ionicons
                name="chatbubbles-outline"
                color={color}
               size={height(2.5)}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="BillScreen"
        component={BillScreen}
        options={{
          tabBarLabel: "Bill",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#D1FFBD" : "white",
                  paddingHorizontal: width(5),
                borderRadius: width(5),
                paddingVertical: width(0.5),
              }}
            >
              <AntDesign
                name="profile"
                color={color}
               size={height(2.5)}
              />
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="ProfileScreem"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#D1FFBD" : "white",
                  paddingHorizontal: width(5),
                borderRadius: width(5),
                paddingVertical: width(0.5),
              }}
            >
              <AntDesign
                name="user"
                color={color}
               size={height(2.5)}
              />
            </View>
          ),
        }}
      /> */}
      {/* <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" color={color} size={focused?height(3):height(2.5)}/>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};
export default MainStack;
