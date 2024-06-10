import * as React from "react";
import App from "./src/App";
import { Provider } from "react-redux";
import store, { persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import FlashMessage from "react-native-flash-message";

const MainApp = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
      <FlashMessage position="top" />
    </Provider>
  );
};
export default MainApp;
