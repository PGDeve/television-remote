import { useEffect } from "react";
import { io } from "socket.io-client";
import { ChannelData } from "../model/app.model";
import { useAppDispatch } from "../store/hooks";
import { setCurrentChannel } from "../store/remote/remoteSlice";

const URL_ORIGIN = process.env.REACT_APP_BE_ORIGIN as string;

export function useSocket() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = io(URL_ORIGIN);
    socket.on("current-channel", (data: ChannelData | null) => {
      if (data) {
        dispatch(setCurrentChannel(data));
      }
    });

    return () => {
      socket.removeAllListeners("current-channel");
    };
  }, [dispatch]);
}