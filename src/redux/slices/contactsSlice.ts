import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProfile } from "../../utills/types";

interface ContactsState {
  contacts: IProfile[];
}

const initialState: ContactsState = {
  contacts: [],
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setAllContacts(state, action: PayloadAction<IProfile[]>) {
      state.contacts = action.payload;
    },
  },
});

export const { setAllContacts } = contactsSlice.actions;

export default contactsSlice.reducer;
