import { useEffect, useMemo, useState } from "react";
import "./index.css";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import { formatMinute } from "../../utils/format";

interface Props {
  audioRef: HTMLAudioElement;
}

export const Controller = (props: Props) => {
  const { audioRef } = props;
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [currentTime, setCurrentTime] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [dragLock, setDragLock] = useState<boolean>(true);

  const offsetX = useMemo(() => {
    if (!currentTime || !duration) return 0;
    const track = document.getElementById("track");
    return (currentTime / duration) * track.clientWidth;
  }, [currentTime]);

  useEffect(() => {
    setInterval(() => {
      const el: HTMLAudioElement = document.getElementById(
        "audio"
      ) as HTMLAudioElement;
      setCurrentTime(el?.currentTime || 0);
      setDuration(el?.duration || 0);
    }, 100);
  }, []);

  useEffect(() => {
    if (!dragLock) {
      const cb = () => setDragLock(true);
      window.addEventListener("mouseup", cb);
      return window.removeEventListener("mouseup", cb);
    }
  }, []);

  return (
    <div className="controller-wrap">
      <div id="track">
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: offsetX,
            backgroundColor: "#2d2d2d",
            borderRadius: "5px",
          }}
        />
        <div
          id="dot"
          style={{
            transform: `translateX(calc(${offsetX}px - 50%)`,
          }}
          onMouseDown={() => setDragLock(false)}
          onMouseMove={(e) => {
            if (!dragLock) {
              console.log("e=", e.clientX);
            }
          }}
        ></div>
      </div>
      <div id="timer">{`${formatMinute(currentTime)} / ${formatMinute(
        duration
      )}`}</div>
    </div>
  );
};
