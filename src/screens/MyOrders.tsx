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
import { height } from "../utills/Dimension";
import OrderItem from "../components/OrderItem";
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

  const renderOrder = ({ item }: { item: IBill }) => <OrderItem item={item} />;

  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Header
          searchText={searchText}
          setSearchText={setSearchText}
          showTopHead={false}
          // categories={d} 
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
    paddingHorizontal: height(2),
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
    fontSize: height(2.2),
    fontWeight: "bold",
    padding: height(1),
  },
  orderContainer: {
    marginBottom: 20,
    padding: 10,
    flex: 1,
    borderRadius: 5,
  },
  customerName: {
    fontSize: height(1.7),
  },
  orderId: {
    fontSize: height(1.9),
    fontWeight: "bold",
    color: Color.primaryColor,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: height(1.5),
    color: "#999",
  },
});

export default MyOrdersScreen;
