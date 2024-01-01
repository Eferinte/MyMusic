import { useCallback, useEffect, useState } from "react";
import { axiosInstance, request } from "../../utils/request";
import { upload } from "../../utils/uploader";
import "./index.css";
import { useLyric } from "./useLyric";
import { useCurrTime } from "../../hooks/useCurrTime";

interface Props {
  updateList: () => void;
  musicId: number;
}

const Lyricor = (props: Props) => {
  const { updateList, musicId } = props;
  const [rawLyric, setRawLyric] = useState<string>();
  const { currentTime } = useCurrTime();

  const { lines } = useLyric(rawLyric, currentTime, (total) => total / 3);

  const loadLyric = useCallback((id: number) => {
    request(`getLyric?id=${id}`, "GET").then((res) => {
      if (res.data?.data) setRawLyric(res.data?.data);
      else setRawLyric(undefined);
    });
  }, []);

  useEffect(() => {
    if (musicId) loadLyric(musicId);
  }, [musicId, loadLyric]);

  const handleUpload = useCallback(() => {
    upload(
      (e: any) => {
        if (e.target.files[0]) {
          const fullName: string = e.target.files[0].name;
          const dotIndex: number = fullName.lastIndexOf(".");
          if (dotIndex !== -1) {
            axiosInstance
              .post(
                "uploadLyric",
                {
                  relatedMusicId: musicId,
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
                  loadLyric(musicId);
                }
              });
          } else {
            throw Error("illegal file name");
          }
        }
      },
      [".lrc"]
    );
  }, [musicId]);

  return (
    <div>
      <div id="lyric-panel">
        {lines?.map((line, lineIndex) =>
          line.text.map((track, trackIndex) => (
            <div
              key={lineIndex + "_" + trackIndex}
              className={line.active ? "line-active" : "line"}
            >
              {track}
            </div>
          ))
        )}
      </div>
      <div
        id="lyricUploader"
        //   style={{ position: "absolute", bottom: 20 }}
        onClick={handleUpload}
      >
        UPLOAD LYRIC
      </div>
    </div>
  );
};
export default Lyricor;
