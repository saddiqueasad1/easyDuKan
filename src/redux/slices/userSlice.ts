import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string;
  selectedBranchId: string;
  isProfileComplete: boolean;
}

interface SetUserPayload {
  uid: string;
  selectedBranchId: string;
  isProfileComplete: boolean;
}

const initialState: UserState = {
  uid: "",
  selectedBranchId: "",
  isProfileComplete: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      state.uid = action.payload.uid;
      state.selectedBranchId = action.payload.selectedBranchId;
      state.isProfileComplete = action.payload.isProfileComplete;
    },
    clearUser: (state) => {
      state.uid = "";
      state.selectedBranchId = "";
      state.isProfileComplete = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
