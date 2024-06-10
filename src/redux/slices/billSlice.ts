import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBill, IItem } from "../../utills/types";

interface BillState {
  bill: IBill | null;
}

const initialState: BillState = {
  bill: null,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    setBill: (state, action: PayloadAction<IBill>) => {
      state.bill = action.payload;
    },
    clearBill: (state) => {
      state.bill = null;
    },

    increaseQuantity: (state, action: PayloadAction<IItem>) => {
      if (state.bill) {
        const { id, description, unitPrice, name, purchasePrice } =
          action.payload;
        let item = state.bill.items.find((item) => item.id === id);
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
          state.bill.items.push(itemNew);
        }
        state.bill.totalAmount = state.bill.items.reduce(
          (sum, item) => sum + item.total,
          0,
        );
        state.bill.totalQuantity = state.bill.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
      }
    },

    decreaseQuantity: (state, action: PayloadAction<IItem>) => {
      if (state.bill) {
        const itemIndex = state.bill.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (itemIndex !== -1) {
          const item = state.bill.items[itemIndex];
          if (item.quantity > 1) {
            item.quantity -= 1;
            item.total = item.quantity * item.unitPrice;
          } else {
            state.bill.items.splice(itemIndex, 1);
          }
          state.bill.totalAmount = state.bill.items.reduce(
            (sum, item) => sum + item.total,
            0,
          );
          state.bill.totalQuantity = state.bill.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
        }
      }
    },
    removeAllBills(state) {
      console.log("state of redux",state);
      
      state.bill = null;
    },
  },
});

export const { setBill, clearBill, increaseQuantity, decreaseQuantity,removeAllBills } =
  billSlice.actions;

export default billSlice.reducer;
