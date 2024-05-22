import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IPrrofile {
  username: string;
  phoneNumber: string;
  email: string;
  address: string;
}

const profileSilse = createSlice({
  name: "profile",
  initialState: {
    username: "",
    phoneNumber: "",
    email: "",
    address: "",
  },
  reducers: {
    setProfile(state, action: PayloadAction<IPrrofile>) {
      state.username = action.payload.username;
      state.phoneNumber = action.payload.phoneNumber;
      state.email = action.payload.email;
      state.address = action.payload.address;
    },
  },
});

export const { setProfile } = profileSilse.actions;

export default profileSilse.reducer;
