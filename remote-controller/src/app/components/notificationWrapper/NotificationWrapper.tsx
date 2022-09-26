import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectError, setError } from "../../../store/remote/remoteSlice";
import { Notification } from "../notification/Notification";

const TRANSITION_DURATION = 300;

export const NotificationWrapper = ({ autoHide = true }) => {
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  const removeNotification = useCallback(() => {
    window.setTimeout(() => dispatch(setError(null)), TRANSITION_DURATION);
  }, [dispatch]);

  return error ? (
    <Notification
      autoHide={autoHide}
      error={error}
      removeNotification={removeNotification}
      transitionDuration={TRANSITION_DURATION}
    ></Notification>
  ) : (
    <></>
  );
};
