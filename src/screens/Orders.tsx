import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Head";

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  totalQuantity: number;
  products: {
    productId: string;
    name: string;
    category: string;
    quantity: number;
  }[];
}
const OrdersScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customerId: "CUST123",
      customerName: "John Doe",
      totalQuantity: 3,
      products: [
        {
          productId: "P001",
          name: "T-Shirt",
          category: "Clothing",
          quantity: 1,
        },
        { productId: "P002", name: "Jeans", category: "Clothing", quantity: 2 },
      ],
    },
    {
      id: "2",
      customerId: "CUST456",
      customerName: "Jane Smith",
      totalQuantity: 1,
      products: [
        {
          productId: "P003",
          name: "Book",
          category: "Stationery",
          quantity: 1,
        },
      ],
    },
  ]);

  // Dummy data for demonstration purposes

  // Simulate fetching orders from an API or database
  // Replace with your actual data fetching logic

  const renderOrder = ({ item }: { item: Order }) => {
    if (
      item?.customerName?.toLowerCase()?.includes(searchText?.toLowerCase())
    ) {
      return (
        <View style={styles.orderContainer}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderTotal}>
            Total Quantity: {item.totalQuantity}
          </Text>
          <FlatList
            data={item.products}
            renderItem={({ item }: { item: Order["products"][number] }) => (
              <View style={styles.productItem}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetails}>
                  Category: {item.category}, Quantity: {item.quantity}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.productId}
          />
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
        <Text style={styles.header}>Orders</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders}
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
  productItem: {
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
  },
  productDetails: {
    fontSize: 14,
    color: "#ccc",
  },
});

export default OrdersScreen;
