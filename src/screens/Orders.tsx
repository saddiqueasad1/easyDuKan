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
import OrderItem from "../components/OrderItem";
const d = [
  { id: 1, name: "Complete" },
  { id: 2, name: "Uncomplete" },
  { id: 3, name: "Pending" },
  { id: 4, name: "Cancel" },
];
const OrdersScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectValue, SetSelectValue] = useState();
  const profile = useSelector((state: RootState) => state.profile);
  const [incomingOrders, setIncomingOrders] = useState<IBill[]>([]);

  useEffect(() => {
    const customerId = profile.userId;

    getOrdersByShopUserId(customerId).then((orders) => {
      console.log("orders 222");
      console.log(orders);
      setIncomingOrders(orders);
    });
  }, []);

  // const renderOrder = ({ item }: { item: IBill }) => {
  //   if (
  //     item?.customerName?.toLowerCase()?.includes(searchText?.toLowerCase())
  //   ) {
  //     return (
  //       <View style={styles.orderContainer}>
  //         <Text style={styles.customerName}>{item.customerName}</Text>
  //         <Text style={styles.orderId}>Order #{item.id}</Text>
  //         <Text style={styles.orderTotal}>
  //           Total Quantity: {item.totalQuantity} , Price {item.totalAmount}
  //         </Text>
  //         <Text style={styles.orderDate}>Date: {item.date}</Text>
  //       </View>
  //     );
  //   }
  // };
  const renderOrder = ({ item }: { item: IBill }) => <OrderItem item={item} />;

  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Header
          searchText={searchText}
          setSearchText={setSearchText}
          categories={d}
          selectValue={selectValue}
          SetSelectValue={SetSelectValue}
        />
      )}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Orders</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={incomingOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
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

export default OrdersScreen;
