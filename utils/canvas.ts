export const screenshot = (canvas: HTMLCanvasElement, fileName?: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const url = canvas.toDataURL("image/png", 1.0);
      const a = document.createElement("a");
      a.download = (fileName || new Date().toISOString()) + ".png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return resolve();
    } catch (error) {
      reject(error);
    }
  });
};
