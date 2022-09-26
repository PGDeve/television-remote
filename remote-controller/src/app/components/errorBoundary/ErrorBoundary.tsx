import React from "react";
import { setError } from "../../../store/remote/remoteSlice";
import { store } from "../../../store/store";
import { NotificationWrapper } from "../notificationWrapper/NotificationWrapper";

class ErrorBoundary extends React.Component {
  state: { hasError: boolean };

  constructor(public props: { children: JSX.Element | JSX.Element[] }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    store.dispatch(
      setError({
        title: "An Error Occurred!",
        description: "Please refresh your browser and try again!",
      })
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-300">
          <NotificationWrapper autoHide={false}></NotificationWrapper>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
