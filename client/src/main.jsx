import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore.js";

let presistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={presistor}>
        <App />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>
);
