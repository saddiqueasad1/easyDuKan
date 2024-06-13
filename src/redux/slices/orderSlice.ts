import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBill, IItem } from "../../utills/types";

interface OrderState {
  order: IBill | null;
}

const initialState: OrderState = {
  order: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<IBill>) => {
      state.order = action.payload;
    },
    clearOrder: (state) => {
      state.order = null;
    },
    increaseOrderQuantity: (state, action: PayloadAction<IItem>) => {
      if (state.order) {
        const { id, description, unitPrice, name, purchasePrice } =
          action.payload;
        let item = state.order.items.find((item) => item.id === id);
        if (item) {
          item.quantity += 1;
          item.total = item.quantity * item.unitPrice;
        } else {
          const itemNew: IItem = {
            id,
            description,
            quantity: 1,
            unitPrice,
            total: unitPrice,
            purchasePrice,
            name: name,
          };
          state.order.items.push(itemNew);
        }
        state.order.totalAmount = state.order.items.reduce(
          (sum, item) => sum + item.total,
          0,
        );
        state.order.totalQuantity = state.order.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
      }
    },

    decreaseOrderQuantity: (state, action: PayloadAction<IItem>) => {
      if (state.order) {
        const itemIndex = state.order.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (itemIndex !== -1) {
          const item = state.order.items[itemIndex];
          if (item.quantity > 1) {
            item.quantity -= 1;
            item.total = item.quantity * item.unitPrice;
          } else {
            state.order.items.splice(itemIndex, 1);
          }
          state.order.totalAmount = state.order.items.reduce(
            (sum, item) => sum + item.total,
            0,
          );
          state.order.totalQuantity = state.order.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
        }
      }
    },
    removeAllOrders(state) {
      state.order = null;
    },
  },
});

export const {
  setOrder,
  clearOrder,
  increaseOrderQuantity,
  decreaseOrderQuantity,
  removeAllOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
