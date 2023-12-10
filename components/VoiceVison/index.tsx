import { useCallback, useEffect, useRef } from "react";
import "./index.css";

interface Props {
  audio: HTMLAudioElement;
}

export const VoiceVison = (props: Props) => {
  const { audio } = props;
  if (!audio) return;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 创建 AudioContext
    const audioContext = new window.AudioContext();
    var analyser = audioContext.createAnalyser();
    // 创建 MediaElementAudioSourceNode
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    source.connect(audioContext.destination);

    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    const draw = () => {
      if (!canvasRef.current) return;
      const drawVisual = requestAnimationFrame(draw);
      //   const bCR = canvasRef.current.getBoundingClientRect();
      //   const WIDTH = bCR.width;
      //   const HEIGHT = bCR.height;
      const HEIGHT = window.innerHeight / 1.5;
      const WIDTH = (window.innerWidth * 0.85) / 1.5;
      const SIZE = Math.min(HEIGHT, WIDTH);
      canvasRef.current.width = SIZE;
      canvasRef.current.height = SIZE;

      analyser.getByteFrequencyData(dataArray);

      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.clearRect(0, 0, SIZE, SIZE);
      canvasCtx.fillStyle = "rgba(255, 255, 255,1)";
      canvasCtx.fillRect(0, 0, SIZE, SIZE);

      canvasCtx.translate(SIZE / 2, SIZE / 2);

      var barWidth = SIZE / bufferLength;
      var barHeight;
      var x = 0;

      const useRatio = 0.5;

      for (
        var i = ((bufferLength * (1 - useRatio)) / 2) | 0;
        i < ((bufferLength * (0.5 + useRatio / 2)) | 0);
        i++
      ) {
        barHeight = dataArray[i];

        const heightCorrection = (i / bufferLength) * 30;

        // console.log(barHeight);

        canvasCtx.rotate(((2 / bufferLength) * Math.PI) / useRatio);
        canvasCtx.fillStyle = `rgba(100,100,100,${
          (barHeight / SIZE) * 0.5 + 0.5
        })`;
        canvasCtx.fillRect(
          0,
          SIZE / 4.5,
          barWidth / useRatio,
          barHeight + heightCorrection
        );

        x += barWidth + 1;
      }
    };

    draw();
  }, [audio]);

  return <canvas id="vison" ref={canvasRef} />;
};
