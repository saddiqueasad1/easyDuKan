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
import GlobalMethods from "../utills/GlobalMethods";
const d = [
  { id: 1, name: "Complete" },
  { id: 2, name: "Uncomplete" },
  { id: 3, name: "Pending" },
  { id: 4, name: "Cancel" },
];
const MyOrdersScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectValue, SetSelectValue] = useState();
  const profile = useSelector((state: RootState) => state.profile);
  const [outgoingOrders, setOutgoingOrders] = useState<IBill[]>([]);

  useEffect(() => {
    const customerId = profile.userId;

    getOrdersByCustomerId(customerId).then((orders) => {
      console.log("orders 11111");

      // console.log(orders);
      setOutgoingOrders(orders.reverse());
    });
  }, []);

  const renderOrder = ({ item }: { item: IBill }) => {
    if (
      item?.customerName?.toLowerCase()?.includes(searchText?.toLowerCase())
    ) {
      console.log(item);

      return (
        <View style={styles.orderContainer}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderTotal}>
            Total Quantity: {item.totalQuantity} , Price {item.totalAmount}
          </Text>
          <Text style={styles.orderDate}>
            Date: {GlobalMethods.calculateTimeDifference(item.date)}
          </Text>
        </View>
      );
    }
  };

  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Header
          searchText={searchText}
          setSearchText={setSearchText}
          showTopHead={false}
          categories={d}
          selectValue={selectValue}
          SetSelectValue={SetSelectValue}
        />
      )}
    >
      <View style={styles.container}>
        <Text style={styles.header}>My Placed Orders</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={outgoingOrders}
          renderItem={renderOrder}
          keyExtractor={(item, index) => item.id + index}
          // ListHeaderComponent={<}
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
