import { useCallback, useEffect, useRef } from "react";
import { AppError } from "../../../model/app.model";

type NotificationProps = {
  removeNotification: () => void;
  error: AppError;
  transitionDuration: number;
};

export const Notification = ({
  removeNotification,
  error,
  transitionDuration,
}: NotificationProps) => {
  const notification = useRef<HTMLDivElement | null>(null);

  const hideNotification = useCallback(() => {
    if (notification.current) {
      notification.current.classList.add("translate-x-full");
    }
    removeNotification();
  }, [removeNotification]);

  useEffect(() => {
    window.setTimeout(
      () =>
        notification.current &&
        notification.current.classList.remove("translate-x-full"),
      1
    );
  }, [hideNotification]);

  return (
    <div
      ref={notification}
      data-testid="notification"
      className={`bg-white/60 hover:bg-white/80 hover:shadow-lg transition duration-${transitionDuration} ease-linear backdrop-blur-xl z-20 max-w-md absolute right-5 top-5 rounded-lg p-6 shadow cursor-pointer translate-x-full`}
      onClick={() => hideNotification()}
    >
      <h1 className="text-xl text-slate-700 font-medium inline-flex w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-8 h-8 text-red-500 mr-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {error.title}
      </h1>
      <div className="text-slate-500 text-sm inline-flex space-x-1 items-center ml-0 sm:ml-11">
        {error.description}
      </div>
    </div>
  );
};
