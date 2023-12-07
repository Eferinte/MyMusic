import { Dispatch, useCallback, useState } from "react";
import "./index.css";
import { Action, State } from "../Player";
import { request } from "../../utils/request";
import { Hinter } from "../Hinter/indext";

export interface Music {
  name: string;
  dataPath: string;
  totalTime: number;
  currentTime: number;
  id: number;
}

interface Props {
  list: Music[];
  dispatch: Dispatch<Action>;
  state: State;
}

export const MusicList = (props: Props) => {
  const { list, dispatch, state } = props;

  const tryPlay = useCallback((music: Music, index: number) => {
    request(`checkSrc?id=${music.id}`, "GET").then((res) => {
      if (res.data.code === 2000) dispatch({ type: "playNew", data: index });
      else Hinter({ message: res.data.message });
    });
  }, []);

  const musicRender = useCallback(
    (music: Music, key: number) => {
      return (
        <div
          style={{ animationDelay: key + "00ms" }}
          className={
            state.currentIndex === key ? "music-row-active" : "music-row"
          }
          key={key}
          onClick={() => tryPlay(music, key)}
        >
          {music.name}
        </div>
      );
    },
    [state]
  );

  return (
    <div className="list-wrap">
      {list.map((music, index) => musicRender(music, index))}
    </div>
  );
};
