import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { SpinePlayer } from "@esotericsoftware/spine-player";
import { screenshot } from "../../utils/canvas";

function startRecording(canvas: HTMLCanvasElement, length) {
  const chunks = []; // here we will store our recorded media chunks (Blobs)
  const stream = canvas.captureStream(); // grab our canvas MediaStream
  const rec = new MediaRecorder(stream); // init the recorder
  // every time the recorder has new data, we will store it in our array
  rec.ondataavailable = (e) => chunks.push(e.data);
  // only when the recorder stops, we construct a complete Blob from all the chunks
  rec.onstop = (e) => exportVid(new Blob(chunks, { type: "video/mp4" }));

  rec.start();
  setTimeout(() => rec.stop(), length); // stop recording in 3s
}

function exportVid(blob) {
  const vid = document.createElement("video");
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  document.body.appendChild(vid);
  const a = document.createElement("a");
  a.download = "myvid.webm";
  a.href = vid.src;
  a.textContent = "download the video";
  document.body.appendChild(a);
}

interface Props {
  style?: CSSProperties;
}

interface SpineRef {
  play: () => void;
}

export const Spine = forwardRef<SpineRef, Props>((props: Props, ref) => {
  const { style } = props;
  const [player, setPlayer] = useState<SpinePlayer>();

  const play = useCallback(() => {
    player?.play();
  }, [player]);

  const playState = player?.animationState;

  console.log("state=", player?.paused);

  useImperativeHandle(
    ref,
    () => {
      return {
        play,
      };
    },
    [play]
  );

  useEffect(() => {
    try {
      const player = new SpinePlayer("player-container", {
        preserveDrawingBuffer: true,
        // jsonUrl:
        //   "http://esotericsoftware.com/files/examples/4.0/spineboy/export/spineboy-pro.json",
        // atlasUrl:
        //   "http://esotericsoftware.com/files/examples/4.0/spineboy/export/spineboy.atlas",
        jsonUrl: "http://localhost:8080/MyMusic/api/file/P13668.json",
        atlasUrl: "http://localhost:8080/MyMusic/api/file/P13668.atlas",
        alpha: true,
        backgroundColor: "#00000000",
      });
      setPlayer(player);
      // startRecording(canvas, 5000);
    } catch (error) {
      console.log("SPINE ERROR", error);
    }
  }, []);

  return (
    <>
      <div
        id="player-container"
        style={{ width: 1024, height: 1024, ...style }}
      ></div>
      <div
        onClick={() => {
          if (player?.paused) {
            let frame = 1;
            const _screenshot = () =>
              requestAnimationFrame(() => {
                screenshot(player.canvas, "カガリ" + frame);
                frame++;
                if (frame < 60) _screenshot();
              });
            _screenshot();
            play();
          } else player.pause();
        }}
        style={{
          cursor: "pointer",
          position: "fixed",
          left: 200,
          top: 200,
          height: 40,
          width: 120,
          borderRadius: 16,
          boxShadow: "2px 2px 10px 0 silver",
        }}
      ></div>
    </>
  );
});
