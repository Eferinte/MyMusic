import { useEffect, useState } from "react";

export const useDevice = () => {
  const [platform, setPlatform] = useState<string>();
  useEffect(() => {
    const infos = window.navigator.userAgent
      .split("(")?.[1]
      .split(")")?.[0]
      .split(";");
    console.log(
      "infos = ",
      infos.map((o) => o.trim())
    );
    setPlatform(infos?.[0]);
  }, []);
  return { platform };
};
