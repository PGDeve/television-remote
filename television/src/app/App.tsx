import { useEffect, useRef } from "react";
import { useAppSelector } from "../store/hooks";
import {
  selectCurrentChannelData,
  selectIsLoading,
} from "../store/television/televisionSlice";
import { useRenderScene, useSocket } from "../utils/hooks";
import { Header } from "./components/header/Header";
import { NotificationWrapper } from "./components/notificationWrapper/NotificationWrapper";
import { Spinner } from "./components/spinner/Spinner";

function App() {
  const isLoading = useAppSelector(selectIsLoading);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { code, description, type, url } = useAppSelector(
    selectCurrentChannelData
  );
  const { render, destroy } = useRenderScene(canvas, type, url);
  useSocket();

  useEffect(() => {
    // Render scene
    render();

    //Rerender scene if window is resized
    const rerenderAfterResize = () => {
      destroy();
      render();
    };
    window.addEventListener("resize", rerenderAfterResize);

    return () => {
      destroy();
      window.removeEventListener("resize", rerenderAfterResize);
    };
  }, [canvas, code, render, destroy]);

  return (
    <>
      <NotificationWrapper></NotificationWrapper>
      {isLoading ? <Spinner></Spinner> : <></>}
      <div className="w-screen h-screen absolute top-0 left-0">
        <Header
          code={code}
          description={description}
        />
        <canvas
          className="w-screen h-screen absolute top-0 left-0 z-0 bg-slate-300"
          ref={canvas}
          aria-label="canvas"
        ></canvas>
      </div>
    </>
  );
}

export default App;
