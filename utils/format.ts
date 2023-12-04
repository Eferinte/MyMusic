export const formatMinute = (seconds: number): string => {
  return `${(Math.floor(seconds / 60) + "").padStart(2, "0")}:${(
    Math.floor(seconds % 60) + ""
  ).padStart(2, "0")}`;
};
