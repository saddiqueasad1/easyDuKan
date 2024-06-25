import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Head";
import { getOrdersByCustomerId, getOrdersByShopUserId } from "../api/orders";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IBill } from "../utills/types";
import { Color } from "../utills/GlobalStyles";

const MyOrdersScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("incoming");
  const profile = useSelector((state: RootState) => state.profile);
  const [outgoingOrders, setOutgoingOrders] = useState<IBill[]>([]);

  useEffect(() => {
    const customerId = profile.userId;

    getOrdersByCustomerId(customerId).then((orders) => {
      console.log("orders 11111");

      console.log(orders);
      setOutgoingOrders(orders);
    });
  }, []);

  const renderOrder = ({ item }: { item: IBill }) => {
    if (
      item?.customerName?.toLowerCase()?.includes(searchText?.toLowerCase())
    ) {
      return (
        <View style={styles.orderContainer}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderTotal}>
            Total Quantity: {item.totalQuantity} , Price {item.totalAmount}
          </Text>
          <Text style={styles.orderDate}>Date: {item.date}</Text>
        </View>
      );
    }
  };


  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Header searchText={searchText} setSearchText={setSearchText} />
      )}
    >
      <View style={styles.container}>
        <Text style={styles.header}>My Placed Orders</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={outgoingOrders}
          renderItem={renderOrder}
          keyExtractor={(item,index) => item.id+index}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: Color.primaryColor,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orderId: {
    fontSize: 16,
    color: "#ccc",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 14,
    color: "#999",
  },
});

export default MyOrdersScreen;
