import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string;
  isProfileComplete: boolean;
}

interface SetUserPayload {
  uid: string;
  isProfileComplete: boolean;
}

const initialState: UserState = {
  uid: "",
  isProfileComplete: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      state.uid = action.payload.uid;
      state.isProfileComplete = action.payload.isProfileComplete;
    },
    clearUser: (state) => {
      state.uid = "";
      state.isProfileComplete = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
