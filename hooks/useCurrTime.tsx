import { useState, useEffect } from "react";

export const useCurrTime = () => {
  const [currentTime, setCurrentTime] = useState<number>();

  useEffect(() => {
    const timer = setInterval(() => {
      const el: HTMLAudioElement = document.getElementById(
        "audio"
      ) as HTMLAudioElement;
      setCurrentTime(el?.currentTime || 0);
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return {
    currentTime,
  };
};
