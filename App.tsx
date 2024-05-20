import * as React from "react";
import App from "./src/App";
import { Provider } from "react-redux";
import store from "./src/redux/store";

const MainApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
export default MainApp;
