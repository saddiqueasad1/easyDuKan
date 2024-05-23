import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IProfile {
  username: string;
  phoneNumber: string;
  email: string;
  address: string;
  userId?: string;
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
    setProfile(state, action: PayloadAction<IProfile>) {
      state.username = action.payload.username;
      state.phoneNumber = action.payload.phoneNumber;
      state.email = action.payload.email;
      state.address = action.payload.address;
    },
  },
});

export const { setProfile } = profileSilse.actions;

export default profileSilse.reducer;
