export const upload = (
  successCb?: (e: any) => any,
  allowType: string[] = [".flac", ".mp3", ".wav"]
) => {
  const el = document.createElement("input");
  el.type = "file";
  el.accept = allowType
    .reduce((total, curr) => total + "," + curr, "")
    .slice(1);
  el.click();
  el.onchange = successCb;
};
