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
import { TestWrap } from "../TestWrap";
import { VoiceVison } from "../VoiceVison";
import { useSSE } from "../../hooks/useSSE";
import { API_URL } from "../../constant";
import { Spine } from "../Spine";
import Uploader from "../Uploader";
import Lyricor from "../Lyricor";
import Accessor from "../Accessor";
import { useDevice } from "../../hooks/useDevice";

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
    }
  | {
      type: "updatePlayMode";
      data: PLAY_MODE;
    }
  | {
      type: "updateNeedSynchrone";
      data: boolean;
    };

export enum PLAY_STATE {
  PLAYING = 1,
  STOPPED = 2,
}

export enum PLAY_MODE {
  // LIST = "列表播放",
  RANDOM = "随机播放",
  REPEAT = "单曲循环",
  LIST_REPEAT = "列表循环",
}

export interface State {
  playState: PLAY_STATE;
  currentMusic?: Music;
  musicList: Music[];
  playMode: PLAY_MODE;
  needSynchrone: boolean;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "play":
      (document.getElementById("audio") as HTMLAudioElement).play();
      return {
        ...state,
        playState: PLAY_STATE.PLAYING,
      };
    case "stop": {
      (document.getElementById("audio") as HTMLAudioElement).pause();
      return {
        ...state,
        playState: PLAY_STATE.STOPPED,
      };
    }
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
    case "updatePlayMode": {
      return {
        ...state,
        playMode: action.data,
      };
    }
    case "updateNeedSynchrone": {
      return {
        ...state,
        needSynchrone: action.data,
      };
    }
  }
};

export const Player = (props) => {
  const { platform } = useDevice();

  const [state, dispatch] = useReducer(reducer, {
    playState: PLAY_STATE.STOPPED,
    musicList: [],
    playMode: PLAY_MODE.LIST_REPEAT,
    needSynchrone: false,
  });

  const [ifAccessed, setIfAccessed] = useState<boolean>(false);

  // const {} = useSSE(API_URL + "sse/time", (ev) => {
  //   console.log(ev);
  // });

  const currentindex = state?.musicList?.indexOf(state.currentMusic);

  const audioRef = useRef<HTMLAudioElement>(null);

  const replay = useCallback(() => {
    const audio: HTMLAudioElement = document.getElementById(
      "audio"
    ) as HTMLAudioElement;
    audio.currentTime = 0;
    audio.load();
  }, []);

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

  document.onkeyup = (ev) => {
    if (ev.key === " " && state.currentMusic) {
      if (state.playState === PLAY_STATE.PLAYING) dispatch({ type: "stop" });
      else dispatch({ type: "play" });
      ev.preventDefault();
      ev.stopPropagation();
    }
  };

  const getNextIndex = useCallback(() => {
    switch (state.playMode) {
      // case PLAY_MODE.LIST: {
      //   if (state.currentIndex < state.musicList.length - 1)
      //     return state.currentIndex + 1;
      //   return undefined;
      // }
      case PLAY_MODE.RANDOM: {
        return state.musicList[
          Math.floor(Math.random() * 1000) % state.musicList.length
        ];
      }
      case PLAY_MODE.REPEAT: {
        replay();
        return state.currentMusic;
      }
      case PLAY_MODE.LIST_REPEAT: {
        return state.musicList[(currentindex + 1) % state.musicList.length];
      }
    }
  }, [state, currentindex]);

  const player = useMemo(() => {
    if (!state.currentMusic) return;
    return (
      <audio
        crossOrigin="anonymous"
        ref={audioRef}
        id="audio"
        autoPlay
        preload="auto"
        style={{ position: "absolute", bottom: 100 }}
        src={`${API_URL}api/getMusic?id=${state.currentMusic.id}`}
        onPlay={() => dispatch({ type: "play" })}
        onEnded={() => {
          if (state.playMode === PLAY_MODE.REPEAT) {
            replay();
          } else {
            dispatch({ type: "stop" });
            // 自动连播
            setTimeout(() =>
              dispatch({ type: "playNew", data: getNextIndex() })
            );
          }
        }}
      />
    );
  }, [state.currentMusic, state.playMode, getNextIndex]);

  return (
    <div id="main-wrap">
      {/* <div id="vison-wrap">
        <VoiceVison audio={audioRef.current} />
      </div>
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
      </div> */}

      <div id="list-wrap">
        <MusicList
          updateList={updateList}
          state={state}
          dispatch={dispatch}
          list={state.musicList}
        />
      </div>

      {state?.currentMusic?.id && (
        <div id="lyric-container">
          <Lyricor
            accessed={ifAccessed}
            musicId={state.currentMusic.id}
            updateList={updateList}
          />
        </div>
      )}
      {platform?.includes("Windows") && (
        <Accessor setIfAccessed={setIfAccessed}>
          <Uploader updateList={updateList} />
        </Accessor>
      )}
      {player}
      {/* <Spine style={{ position: "fixed", left: 200, top: 200 }} /> */}

      {/* <TestWrap>
        <div
          style={{
            mixBlendMode: "lighten",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "100px",
              backgroundColor: "rgba(0,255,0,1)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              inset: "100px",
              backgroundColor: "rgba(255,0,0,1)",
            }}
          ></div>
        </div>
      </TestWrap> */}

      <Controller
        state={state}
        dispatch={dispatch}
        audioRef={audioRef.current}
      />
    </div>
  );
};
