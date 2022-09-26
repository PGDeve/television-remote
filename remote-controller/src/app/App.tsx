import { nextChannel, previousChannel } from "../services/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCurrentChannelData,
  selectIsLoading,
  setIsLoading,
} from "../store/remote/remoteSlice";
import { useSocket } from "../utils/hooks";
import { NotificationWrapper } from "./components/notificationWrapper/NotificationWrapper";
import { Remote } from "./components/remote/Remote";
import { Spinner } from "./components/spinner/Spinner";

function App() {
  const isLoading = useAppSelector(selectIsLoading);
  const { code } = useAppSelector(selectCurrentChannelData);
  const dispatch = useAppDispatch();
  useSocket();

  const goPrevious = async () => {
    dispatch(setIsLoading(true));
    previousChannel();
  };

  const goNext = () => {
    dispatch(setIsLoading(true));
    nextChannel();
  };

  return (
    <>
      <NotificationWrapper></NotificationWrapper>
      {isLoading ? <Spinner></Spinner> : <></>}
      <div className="w-screen h-screen flex items-center justify-center bg-slate-300 overflow-hidden">
        <Remote code={code} goPrevious={goPrevious} goNext={goNext}></Remote>
      </div>
    </>
  );
}

export default App;
