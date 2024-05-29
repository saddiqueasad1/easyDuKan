import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userReducer from "./slices/userSlice";
import categoriesReducer from "./slices/categoriesSlice"; // Import your categories slice
import profileReducer from "./slices/profilleSlice";
import productsReducer from "./slices/productSlice";
import billsReducer from "./slices/billsSlice";
import billReducer from "./slices/billSlice";
import contactsReducer from "./slices/contactsSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    categories: categoriesReducer, // Include categories slice without persisting it
    profile: profileReducer,
    products: productsReducer,
    bills: billsReducer,
    bill: billReducer,
    contacts: contactsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
