import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./store/store";
import ErrorBoundary from "./app/components/errorBoundary/ErrorBoundary";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>
);
