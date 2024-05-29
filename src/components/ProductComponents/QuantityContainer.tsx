import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IProduct } from "../../utills/types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import AntDesign from "@expo/vector-icons/AntDesign";

interface QuantityContainerProps {
  item: IProduct;
  handleIncreaseQuantity: (
    id: string,
    currentQuantity: number,
    item: IProduct
  ) => void;
  handleDecreaseQuantity: (
    id: string,
    currentQuantity: number,
    item: IProduct
  ) => void;
}

const QuantityContainer: React.FC<QuantityContainerProps> = ({
  item,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}) => {
  const bill = useSelector((state: RootState) => state.bill.bill);
  const quantityItem = bill?.items.find((oneItem) => oneItem.id === item.id);
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
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QuantityContainer;
