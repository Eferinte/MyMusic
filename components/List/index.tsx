import { Dispatch, useCallback, useEffect, useState } from "react";
import "./index.css";
import { Action, State } from "../Player";
import { request } from "../../utils/request";
import { Hinter } from "../Hinter/indext";
// @ts-ignore
import DragIcon from "./assets/drag.svg";
import { ReactSortable } from "react-sortablejs";
import DragSorter from "../DragSorter";

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
  const [sortList, setSortList] = useState<Music[]>(list);

  useEffect(() => {
    setSortList(list);
  }, [list]);

  const tryPlay = useCallback((music: Music, index: number) => {
    request(`checkSrc?id=${music.id}`, "GET").then((res) => {
      if (res.data.code === 2000) dispatch({ type: "playNew", data: index });
      else Hinter({ message: res.data.message });
    });

    request(
      `http://localhost:8080/MyMusic/api/getMusic?id=${music.id}`,
      "GET"
    ).then((res) => {
      console.log(res);
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
          key={music.id}
          onClick={() => tryPlay(music, key)}
        >
          <div className="music-info">{music.name}</div>
          <img className="drag-icon" src={DragIcon} />
        </div>
      );
    },
    [state]
  );

  return (
    <div className="list-wrap">
      <DragSorter rowHeight={32} list={sortList} setList={setSortList}>
        {list.map((music, index) => musicRender(music, index))}
      </DragSorter>
    </div>
  );
};
