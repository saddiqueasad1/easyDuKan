import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IProduct } from "../../utills/types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Color } from "../../utills/GlobalStyles";
import { height } from "../../utills/Dimension";

interface QuantityContainerProps {
  item: IProduct;
  handleIncreaseQuantity: (
    id: string,
    currentQuantity: number,
    item: IProduct,
  ) => void;
  handleDecreaseQuantity: (
    id: string,
    currentQuantity: number,
    item: IProduct,
  ) => void;
  useOrder?: boolean;
}

const QuantityContainer: React.FC<QuantityContainerProps> = ({
  item,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  useOrder = false,
}) => {
  const bill = useSelector((state: RootState) => state.bill.bill);
  const order = useSelector((state: RootState) => state.order.order);

  // Use either bill or order based on the useOrder prop
  const items = useOrder ? order?.items : bill?.items;
  const quantityItem = items?.find((oneItem) => oneItem.id === item.id);
  const quantity = quantityItem ? quantityItem.quantity : 0;

  return (
    <View style={styles.quantityContainer}>
      {quantity > 0 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDecreaseQuantity(item.id, quantity, item)}
        >
          <AntDesign
            name={quantity === 1 ? "delete" : "minus"}
            size={18}
            color="white"
          />
        </TouchableOpacity>
      )}
      {quantity > 0 && <Text style={styles.quantityText}>{quantity}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleIncreaseQuantity(item.id, quantity, item)}
      >
        <AntDesign name="plus" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor:'rgba(255,255,255,.6)',
    borderRadius:height(1.7)
  },
  quantityText: {
    fontSize: height(2),
    marginHorizontal: height(4),
    fontWeight:'condensedBold',
    color: Color.colorDarkslateblue,
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

export default QuantityContainer;
