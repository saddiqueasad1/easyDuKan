import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBill, IItem } from "../../utills/types";

interface BillsState {
  bills: IBill[];
}

const initialState: BillsState = {
  bills: [],
};

const billsSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {
    addItemToBill: (
      state,
      action: PayloadAction<{ billId: string; item: IItem }>,
    ) => {
      const { billId, item } = action.payload;
      item.totalAmount += item.total;
      state.bills.push(item);
    },
    removeItemFromBill: (
      state,
      action: PayloadAction<{ billId: string; itemId: string }>,
    ) => {
      const { billId, itemId } = action.payload;
      const bill = state.bills.find((bill) => bill.id === billId);
      if (bill) {
        const itemIndex = bill.items.findIndex((item) => item.id === itemId);
        if (itemIndex >= 0) {
          bill.totalAmount -= bill.items[itemIndex].total;
          bill.items.splice(itemIndex, 1);
        }
      }
    },
  },
});

export const { addItemToBill, removeItemFromBill } = billsSlice.actions;
export default billsSlice.reducer;
