import { RefObject, useCallback, useEffect, useRef } from "react";

import Dot from "../model/Dot";
import { useAppDispatch } from "../store/hooks";
import { setIsLoading } from "../store/television/televisionSlice";

import io from "socket.io-client";
import { ChannelData } from "../model/app.model";
import {
    setCurrentChannelData
} from "../store/television/televisionSlice";

const URL_ORIGIN = process.env.REACT_APP_BE_ORIGIN as string;

export function useRenderScene(
    canvas: RefObject<HTMLCanvasElement>,
    type: string,
    url: string
) {
    const interval = useRef<number | undefined>(undefined);
    const animationFrame = useRef<number | undefined>(undefined);
    const videoElement = useRef<HTMLVideoElement | undefined>(undefined);
    const dispatch = useAppDispatch();

    const renderScene = useCallback(() => {
        interval.current = undefined;
        animationFrame.current = undefined;
        videoElement.current = undefined;

        if (canvas && canvas.current) {
            canvas.current.width = canvas.current.clientWidth;
            canvas.current.height = canvas.current.clientHeight;
            const context = canvas.current.getContext(
                "2d"
            ) as CanvasRenderingContext2D;

            if (context) {
                switch (type) {
                    case "image":
                        const img = document.createElement("img") as HTMLImageElement;
                        img.src = url;
                        img.onload = () => {
                            const isImageSmaller = context.canvas.clientWidth - img.width > 0 || context.canvas.clientHeight - img.height > 0;
                            if (isImageSmaller) {
                                context.drawImage(
                                    img,
                                    (context.canvas.clientWidth - img.width) / 2,
                                    (context.canvas.clientHeight - img.height) / 2,
                                    img.width,
                                    img.height
                                )
                            } else {
                                context.drawImage(
                                    img,
                                    0,
                                    0,
                                    context.canvas.clientWidth,
                                    context.canvas.clientHeight,
                                );
                            }
                            dispatch(setIsLoading(false));
                        };
                        break;
                    case "video":
                        videoElement.current = document.createElement(
                            "video"
                        ) as HTMLVideoElement;
                        videoElement.current.src = url;
                        videoElement.current.muted = true;

                        videoElement.current.addEventListener("play", function () {
                            dispatch(setIsLoading(false));
                            interval.current = window.setInterval(
                                () => {
                                    const isFrameImageSmaller = context.canvas.clientWidth - this.videoWidth > 0 || context.canvas.clientHeight - this.videoHeight > 0;
                                    if (isFrameImageSmaller) {
                                        context.drawImage(
                                            this,
                                            (context.canvas.clientWidth - this.videoWidth) / 2,
                                            (context.canvas.clientHeight - this.videoHeight) / 2,
                                            this.videoWidth,
                                            this.videoHeight,
                                        );
                                    } else {
                                        context.drawImage(
                                            this,
                                            0,
                                            0,
                                            context.canvas.clientWidth,
                                            context.canvas.clientHeight,
                                        );
                                    }

                                },
                                // Play video at 30fps
                                1000 / 30
                            );
                        });
                        videoElement.current.addEventListener("ended", function () {
                            // Replay video on end
                            this.play();
                        });

                        videoElement.current.play().catch(
                            e => { process.env.NODE_ENV !== 'production' && console.error(e) }
                        );
                        break;
                    case "render":
                    case "renderColor":
                        const dots: Dot[] = [];
                        for (let i = 0; i < 800; i++) {
                            // Create a new dot
                            const dot = new Dot(
                                context,
                                context.canvas.clientWidth,
                                context.canvas.clientHeight,
                                type === 'renderColor'
                            );
                            dots.push(dot);
                        }
                        const render = (timestamp: DOMHighResTimeStamp) => {
                            // Clear the scene
                            context.clearRect(
                                0,
                                0,
                                context.canvas.clientWidth,
                                context.canvas.clientHeight
                            );

                            // Loop through the dots array and draw every dot
                            for (var i = 0; i < dots.length; i++) {
                                dots[i].draw(timestamp);
                            }

                            animationFrame.current = window.requestAnimationFrame(render);
                        };
                        animationFrame.current = window.requestAnimationFrame(
                            (timestamp) => {
                                dispatch(setIsLoading(false));
                                render(timestamp);
                            }
                        );

                        break;
                }
            }
        }
    }, [canvas, type, url, dispatch]);

    const destroy = useCallback(() => {
        if (interval.current) {
            window.clearInterval(interval.current);
            interval.current = undefined;
        }
        if (animationFrame.current) {
            window.cancelAnimationFrame(animationFrame.current);
            animationFrame.current = undefined;
        }
        if (videoElement.current) {
            videoElement.current.pause();
            videoElement.current.src = "";
            videoElement.current = undefined;
        }
    }, []);

    return {
        render: renderScene,
        destroy,
    };
}

export function useSocket() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const socket = io(URL_ORIGIN);
        socket.on("current-channel", (data: ChannelData | null) => {
            if (data) {
                dispatch(setCurrentChannelData(data));
            }
        });

        return () => {
            socket.removeAllListeners("current-channel");
        };
    }, [dispatch]);
}