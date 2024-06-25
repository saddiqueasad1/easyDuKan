import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import Modal from "react-native-modal";
import SwiperFlatList from "react-native-swiper-flatlist";
import { IBill, IItem, IProduct, IProfile } from "../../utills/types";
import QuantityContainer from "./QuantityContainer";
import { Color } from "../../utills/GlobalStyles";
import { height, urlImage, width } from "../../utills/Dimension";
import Icons, { IconsImage } from "../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  decreaseOrderQuantity,
  increaseOrderQuantity,
  setOrder,
} from "../../redux/slices/orderSlice";
import { getFirestore, serverTimestamp } from "firebase/firestore";

interface ProductItemProps {
  item: IProduct;
  navigation: any;
  shopUser: IProfile | undefined;
  shopUserId: string;
}

const ProductShopItem: React.FC<ProductItemProps> = ({
  item,
  navigation,
  shopUser,
  shopUserId,
}) => {
  const [isShow, setIsShow] = useState(false);
  const closeModel = () => setIsShow(false);
  const order = useSelector((state: RootState) => state.order.order);
  const quantityItem = order?.items.find((oneItem) => oneItem.id === item.id);
  const quantity = quantityItem ? quantityItem.quantity : 0;
  const profile = useSelector((state: RootState) => state.profile);
  console.log("quantity", quantity);
  const dispatch = useDispatch();
  const handleIncreaseQuantity = (
    id: string,
    currentQuantity: number,
    item: IProduct
  ) => {
    const updatedItem: IItem = {
      ...item,
      quantity: currentQuantity + 1,
      total: (currentQuantity + 1) * item?.unitPrice,
    };

    if (order) {
      dispatch(increaseOrderQuantity(updatedItem));
    } else {
      const itemNew: IItem = {
        id,
        description: item.description,
        quantity: 1,
        unitPrice: item.unitPrice,
        total: item.unitPrice,
        purchasePrice: item.purchasePrice,
        name: item.name,
      };

      const newBill: IBill = {
        id: generateId(), // Assuming user.uid is used as billId
        customerId: profile.userId, // Provide customer ID here
        customerName: profile.username, // Provide customer name here
        date: new Date().toISOString(), // Use current date and time
        totalAmount: updatedItem.total,
        status: "pending", // Set initial status
        items: [itemNew],
        totalQuantity: 1,
        shopUserId,
        shopId: shopUser?.branchIds[0] + "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      dispatch(setOrder(newBill));
    }
  };
  function generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  const handleDecreaseQuantity = (
    id: string,
    currentQuantity: number,
    item: IProduct
  ) => {
    const updatedItem: IItem = {
      ...item,
      quantity: currentQuantity - 1,
      total: (currentQuantity - 1) * item?.unitPrice,
    };

    if (order) {
      dispatch(decreaseOrderQuantity(updatedItem));
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.item} onPress={() => setIsShow(true)}>
        <Image
          source={{
            uri: item?.productImages?.length>0 ? item?.productImages[0] : urlImage,
          }}
          style={styles.imaage}
        />
        <Text
          style={[styles.itemText, { fontSize: height(2), fontWeight: "bold" }]}
        >
          {item.name}
        </Text>
        <Text style={styles.itemText}>{item.description}</Text>
        <Text style={styles.itemText}>Price: {item.unitPrice}</Text>
        <Text style={styles.itemText}>
          Total Quantity: {item.totalQuantity}
        </Text>
        <View style={styles.quantityContainer}>
          <QuantityContainer
            item={item}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            useOrder={true}
          />
          {/* <View style={styles.button}>
            {quantity ? (
              <Text style={{ color: "white" }}>{quantity}</Text>
            ) : (
              <AntDesign name="plus" size={18} color="white" />
            )}
          </View> */}
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={isShow}
        // swipeDirection={"down"}
        onBackdropPress={closeModel}
        onBackButtonPress={closeModel}
        // onSwipeComplete={closeModel}
      >
        <View style={styles.item1}>
          {/* <Image source={Icons.p1} style={styles.imaage1} />
           */}
          <View
            style={{
              alignSelf: "center",
              height: height(40),
              width: width(88),
              paddingVertical: height(7),
              backgroundColor: "black",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              borderRadius: height(3),
            }}
          >
            <SwiperFlatList
              showPagination
              data={item?.productImages}
              paginationStyleItemInactive={{
                width: height(1),
                height: height(1),
              }}
              paginationStyle={{
                paddingBottom: height(0),
                alignItems: "center",
              }}
              renderItem={({ item }) => {
                console.log(item);

                return (
                  <Image
                    source={item}
                    resizeMode="contain"
                    style={{
                      width: width(88),
                      height: "100%",
                      // marginTop: height(1),
                      // alignSelf: "center",
                    }}
                    // style={{ flex: 1, resizeMode: "cover" }}
                  />
                );
              }}
            />
          </View>
          <View style={{ marginVertical: height(3) }}>
            <Text
              style={[
                styles.itemText,
                { fontSize: height(2), fontWeight: "bold" },
              ]}
            >
              {item.name}
            </Text>
            <Text style={styles.itemText}>{item.description}</Text>
            <Text style={styles.itemText}>Price: {item.unitPrice}</Text>
            <Text style={styles.itemText}>
              Total Quantity: {item.totalQuantity}
            </Text>
            <View style={styles.quantityContainer1}>
              <QuantityContainer
                item={item}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
                useOrder={true}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    width: width(48),
    margin: height(0.3),
    padding: height(0.3),
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: height(1.5),
    backgroundColor: Color.white,
  },
  item1: {
    width: width(90),
    margin: height(0.3),
    padding: height(0.3),
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: height(3),
    backgroundColor: Color.white,
  },
  itemText: {
    fontSize: height(1.8),
    color: Color.colorDarkslateblue,
    marginBottom: 1,
    marginLeft: width(2),
  },
  quantityContainer: {
    position: "absolute",
    right: height(1),
    top: height(9),
  },
  quantityContainer1: {
    position: "absolute",
    right: height(2),
    bottom: height(2),
  },
  imaage: {
    height: height(15),
    width: "100%",
    borderRadius: height(2),
    marginBottom: height(2),
  },
  imaage1: {
    height: height(40),
    width: "100%",
    borderRadius: height(2),
    marginBottom: height(2),
  },
  button: {
    backgroundColor: Color.primaryColor,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductShopItem;
