import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import "./index.css";
import { Action, State } from "../Player";
import { request } from "../../utils/request";
import { Hinter } from "../Hinter/indext";
// @ts-ignore
import DragIcon from "./assets/drag.svg";
import { ReactSortable } from "react-sortablejs";
import DragSorter from "../DragSorter";
import useGetState from "../../hooks/useGetState";
import { arrayEqual } from "../../utils/format";
import { getCookies } from "../../utils/cookies";

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
  updateList: () => void;
}

export const MusicList = (props: Props) => {
  const { list, dispatch, state, updateList } = props;
  const [sortList, setSortList, getSortList] = useGetState<Music[]>(list);

  useEffect(() => {
    setSortList(list);
  }, [list]);

  useEffect(() => {
    if (
      !arrayEqual<Music>(state.musicList, sortList, (a, b) => a.id === b.id)
    ) {
      console.log("synchrone", getSortList());
      const sort = sortList.map((_) => _.id);
      // 有重复id
      if (new Set(sort).size !== sort.length) return;
      request("resort", "POST", sort, {
        headers: { Authorization: getCookies("token") },
      }).then((res) => {
        res.data.date && updateList();
      });
    }
  }, [state.musicList, sortList]);

  useEffect(() => {
    if (
      list?.length === 0 ||
      sortList?.length === 0 ||
      list.length !== sortList.length
    )
      return;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id !== sortList[i].id) {
        dispatch({ type: "updateNeedSynchrone", data: true });
        return;
      }
    }
    dispatch({ type: "updateNeedSynchrone", data: false });
  }, [list, sortList]);

  const tryPlay = useCallback((music: Music) => {
    request(`checkSrc?id=${music.id}`, "GET").then((res) => {
      if (res.data.code === 2000) dispatch({ type: "playNew", data: music });
      else Hinter({ message: res.data.message });
    });

    // request(
    //   `http://localhost:8080/MyMusic/api/getMusic?id=${music.id}`,
    //   "GET"
    // ).then((res) => {
    //   console.log(res);
    // });
  }, []);

  const musicRender = useCallback(
    (music: Music, key: number) => {
      return (
        <div
          style={{ animationDelay: key + "00ms" }}
          className={
            state.currentMusic?.id === music.id
              ? "music-row-active"
              : "music-row"
          }
          key={music.id}
          onClick={() => tryPlay(music)}
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
        {sortList.map((music, index) => musicRender(music, index))}
      </DragSorter>
    </div>
  );
};
