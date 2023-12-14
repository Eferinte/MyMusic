import { useEffect } from "react";
import { SpinePlayer } from "@esotericsoftware/spine-player";

interface Props {}
export const Spine = (props: Props) => {
  const {} = props;

  useEffect(() => {
    try {
      new SpinePlayer("player-container", {
        preserveDrawingBuffer: true,
        // jsonUrl:
        //   "http://esotericsoftware.com/files/examples/4.0/spineboy/export/spineboy-pro.json",
        // atlasUrl:
        //   "http://esotericsoftware.com/files/examples/4.0/spineboy/export/spineboy.atlas",
        jsonUrl: "http://localhost:8080/MyMusic/api/file/P13668.json",
        atlasUrl: "http://localhost:8080/MyMusic/api/file/P13668.atlas",
      });
    } catch (error) {
      console.log("SPINE ERROR", error);
    }
  }, []);

  return (
    <div id="player-container" style={{ width: 1000, height: 1000 }}></div>
  );
};
