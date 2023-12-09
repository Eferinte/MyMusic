import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import "./index.css";
import { clamp, formatMinute } from "../../utils/format";
import { Action, PLAY_MODE, State } from "../Player";
import useGetState from "../../hooks/useGetState";
//@ts-ignore
import PlayModeListIcon from "./assets/play_mode_list.svg";
//@ts-ignore
import PlayModeRepeatIcon from "./assets/play_mode_repeat.svg";
//@ts-ignore
import PlayModeRandomIcon from "./assets/play_mode_random.svg";

interface Props {
  audioRef: HTMLAudioElement;
  state: State;
  dispatch: Dispatch<Action>;
}

export const Controller = (props: Props) => {
  const { audioRef, state, dispatch } = props;
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [currentTime, setCurrentTime] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [dragging, setDragging, getDragging] = useGetState<boolean>(false);
  const [targetTime, setTargetTime, getTargetTime] = useGetState<number>();

  const modeIcon = useMemo(() => {
    switch (state.playMode) {
      case PLAY_MODE.LIST_REPEAT:
        return PlayModeListIcon;
      case PLAY_MODE.REPEAT:
        return PlayModeRepeatIcon;
      case PLAY_MODE.RANDOM:
        return PlayModeRandomIcon;
    }
  }, [state]);

  const MODE_LIST = [
    // PLAY_MODE.LIST,
    PLAY_MODE.RANDOM,
    PLAY_MODE.REPEAT,
    PLAY_MODE.LIST_REPEAT,
  ];

  const offsetX = useMemo(() => {
    if (!currentTime || !duration) return 0;
    const track = document.getElementById("track");
    return (
      ((dragging ? clamp(targetTime, 0, duration) : currentTime) / duration) *
      track.clientWidth
    );
  }, [currentTime, targetTime, dragging]);

  useEffect(() => {
    const timer = setInterval(() => {
      const el: HTMLAudioElement = document.getElementById(
        "audio"
      ) as HTMLAudioElement;
      if (!getDragging()) {
        setCurrentTime(el?.currentTime || 0);
      }
      setDuration(el?.duration || 0);
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const updateTargetTime: (e: MouseEvent) => void = useCallback((e) => {
    const trackBR = document.getElementById("track").getBoundingClientRect();
    const audio = document.getElementById("audio") as HTMLAudioElement;
    if (!trackBR || !audio || !audio.duration) return;
    const targetX = e.clientX;
    const targetPercent = (targetX - trackBR.x) / trackBR.width;
    const targetTime = Number((targetPercent * audio.duration).toFixed(6));
    setTargetTime(targetTime);
  }, []);

  // 将Drag后的坐标应用到audio中
  useEffect(() => {
    const upCb = () => {
      const audio = document.getElementById("audio") as HTMLAudioElement;
      if (!audio.duration) return;
      if (getDragging()) audio.currentTime = getTargetTime();
      setTimeout(() => setDragging(false));
    };

    window.addEventListener("mouseup", upCb);
    window.addEventListener("mousemove", (ev) => updateTargetTime(ev));
    // return window.removeEventListener("mousedown", cb);
  }, []);

  const handleStartDrag: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      updateTargetTime(e as unknown as MouseEvent);
      setTimeout(() => setDragging(true));
    },
    [updateTargetTime]
  );

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
          id={"dot"}
          style={{
            transition: dragging ? "0s" : "0.25s",
            transform: `translateX(calc(${offsetX}px - 50%)`,
          }}
          onMouseDown={handleStartDrag}
        ></div>
      </div>
      <div id="timer">{`${formatMinute(currentTime)} / ${formatMinute(
        duration
      )}`}</div>

      <div
        id="mode-controller"
        onClick={() => {
          dispatch({
            type: "updatePlayMode",
            data: MODE_LIST[
              (MODE_LIST.findIndex((mode) => mode === state.playMode) + 1) %
                (MODE_LIST.length - 1)
            ],
          });
        }}
      >
        <img id="play-mode-icon" src={modeIcon} />
        <div id="play-mode-text">{state.playMode}</div>
      </div>
    </div>
  );
};
