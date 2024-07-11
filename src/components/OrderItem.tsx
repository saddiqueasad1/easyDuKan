import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

import { height } from "../utills/Dimension";
import GlobalMethods from "../utills/GlobalMethods";
import { Color } from "../utills/GlobalStyles";
import { ScrollView } from "react-native-gesture-handler";
const OrderItem = ({ item }) => {
  const [isShow, setIsShow] = useState(false);
  const closeModel = () => setIsShow(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setIsShow(true)}
        style={{
          flexDirection: "row",
          backgroundColor: "#eee",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: height(1),
          margin: height(0.5),
        }}
      >
        <View style={styles.orderContainer}>
          <Text style={styles.orderId}>{item?.shopName}</Text>
          <Text style={styles.customerName}>Price {item.totalAmount}</Text>
          <Text style={styles.orderTotal}>
            Total Quantity: {item.totalQuantity}
          </Text>
          <Text style={styles.orderDate}>
            Date:
            {GlobalMethods.calculateTimeDifference(item?.date)}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Color.secondaryColor,
            paddingHorizontal: height(2),
            paddingVertical: height(1),
            margin: height(1),
            alignSelf: "flex-start",
            borderRadius: height(1),
          }}
        >
          <Text
            style={{
              color: "green",
              fontWeight: "bold",
              fontSize: height(1.5),
            }}
          >
            Pending
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationIn="bounceIn"
        animationOut={"bounceOut"}
        animationOutTiming={500}
        animationInTiming={1000}
        isVisible={isShow}
        // swipeDirection={"down"}
        onBackdropPress={closeModel}
        onBackButtonPress={closeModel}
        // onSwipeComplete={closeModel}
      >
        <View style={styles.item1}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: height(1),
            }}
          >
            <View style={styles.orderContainer}>
              <Text style={styles.orderId}>{item.shopUserId}</Text>
              <Text style={styles.orderDate}>
                Date:
                {GlobalMethods.calculateTimeDifference(item?.date)}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: Color.secondaryColor,
                paddingHorizontal: height(2),
                paddingVertical: height(1),
                margin: height(1),
                alignSelf: "flex-start",
                borderRadius: height(1),
              }}
            >
              <Text
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: height(1.5),
                }}
              >
                Pending
              </Text>
            </View>
          </View>
          <ScrollView>
            {item?.items?.map((i, index) => (
              <View
                key={index}
                style={{
                  padding: height(1),
                  backgroundColor: Color.backgroundColor,
                  marginVertical: height(0.5),
                  borderRadius: height(1),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>Product Name</Text>
                  <Text>{i.name}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>Price</Text>
                  <Text>{i.unitPrice}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>Quantity</Text>
                  <Text>{i.quantity}</Text>
                </View>
                <Text style={{ alignSelf: "flex-end" }}>
                  {i.unitPrice + "x" + i.quantity + "=" + i.total}
                </Text>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.customerName}>
            Total Products: {item?.items?.length}
          </Text>
          <Text style={styles.orderTotal}>Price:  {item.totalAmount}</Text>
        </View>
      </Modal>
    </>
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
    flex: 1,
    borderRadius: 5,
  },
  customerName: {
    fontSize: height(2.1),
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
  item1: {
    backgroundColor: "white",
    padding: height(2),
    borderRadius: height(3),
  },
});

export default OrderItem;
