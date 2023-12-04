import {
  useState,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import "./index.css";
import { Music, MusicList } from "../List";
import { axiosInstance, request } from "../../utils/request";
import { upload } from "../../utils/uploader";
import { Controller } from "../Controller";

export type Action =
  | {
      type: "updateList";
      data: Music[];
    }
  | {
      type: "play";
    }
  | {
      type: "stop";
    }
  | {
      type: "playNew";
      data: Music;
    };

export enum PLAY_STATE {
  PLAYING = 1,
  STOPPED = 2,
}

export interface State {
  playState: PLAY_STATE;
  currentMusic?: Music;
  musicList: Music[];
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "play":
      return {
        ...state,
        playState: PLAY_STATE.PLAYING,
      };
    case "stop":
      return {
        ...state,
        playState: PLAY_STATE.STOPPED,
      };
    case "playNew": {
      return {
        ...state,
        playState: PLAY_STATE.PLAYING,
        currentMusic: action.data,
      };
    }
    case "updateList": {
      return {
        ...state,
        musicList: action.data,
      };
    }
  }
};

export const Player = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    playState: PLAY_STATE.STOPPED,
    musicList: [],
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const updateList = useCallback(() => {
    request("query", "POST").then((res) => {
      dispatch({
        type: "updateList",
        data: res.data.map((item) => ({
          name: item.name,
          dataPath: item.path,
          totalTime: 0,
          currentTime: 0,
          id: item.id,
        })),
      });
    });
  }, []);

  useEffect(() => {
    updateList();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const listener = () => console.log("load error");
      audioRef.current.addEventListener("error", listener);
      return audioRef.current.removeEventListener("error", listener);
    }
  }, []);

  const handleUpload = useCallback(() => {
    upload((e: any) => {
      if (e.target.files[0]) {
        // 考虑获取音频信息  https://github.com/aadsm/jsmediatags
        const fullName: string = e.target.files[0].name;
        const dotIndex: number = fullName.lastIndexOf(".");
        if (dotIndex !== -1) {
          axiosInstance
            .post(
              "upload",
              {
                name: fullName.slice(0, dotIndex),
                suffix: fullName.slice(dotIndex + 1),
                data: e.target.files[0],
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              if (res.data.data) {
                updateList();
              }
            });
        } else {
          throw Error("illegal file name");
        }
      }
    });
  }, []);

  return (
    <div id="main-wrap">
      <div className="player-wrap">
        <div
          id={
            state.playState === PLAY_STATE.PLAYING
              ? "cover-wrap-active"
              : "cover-wrap"
          }
          onClick={() => {
            state.playState === PLAY_STATE.PLAYING
              ? dispatch({ type: "stop" })
              : dispatch({ type: "play" });
          }}
        >
          <div id="cover-center" />
          <div id="cover-ring" />
        </div>
      </div>
      <div id="list-wrap">
        <MusicList state={state} dispatch={dispatch} list={state.musicList} />
      </div>

      <div
        id="uploader"
        style={{ position: "absolute", bottom: 20 }}
        onClick={handleUpload}
      >
        UPLOAD
      </div>
      {state.currentMusic?.id && (
        <audio
          ref={audioRef}
          id="audio"
          autoPlay
          preload="auto"
          style={{ position: "absolute", bottom: 100 }}
          onSuspend={() => console.log("loading")}
          src={`http://localhost:8080/MyMusic/api/getMusic?id=${state.currentMusic.id}`}
          onEnded={() => dispatch({ type: "stop" })}
        ></audio>
      )}
      <Controller audioRef={audioRef.current} />
    </div>
  );
};
