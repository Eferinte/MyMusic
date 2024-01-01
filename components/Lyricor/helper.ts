/**
 * 仅支持分钟：秒形式的时间解析
 * @param timeStr
 * @returns
 */
export const timeAnalyzer = (timeStr: string): number => {
  const timePieces = timeStr.split(":");
  return Number(timePieces?.[0] || 0) * 60 + Number(timePieces?.[1] || 0);
};
