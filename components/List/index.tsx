import { Dispatch, useCallback, useState } from "react";
import "./index.css";
import { Action } from "../Player";
import { request } from "../../utils/request";

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
}

export const MusicList = (props: Props) => {
  const { list, dispatch } = props;

  const musicRender = useCallback((music: Music, key: number) => {
    return (
      <div
        className="music-row"
        key={key}
        onClick={() => dispatch({ type: "playNew", data: music })}
      >
        {music.name}
      </div>
    );
  }, []);

  return (
    <div className="list-wrap">
      {list.map((music, index) => musicRender(music, index))}
    </div>
  );
};
