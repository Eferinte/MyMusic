import { useCallback, useEffect, useMemo, useState } from "react";
import { timeAnalyzer } from "./helper";

export interface Line {
  text: string[];
  start: number;
  end?: number;
  active: boolean;
}

export const analyzeRawLyricToLine = (raw: string): Line[] => {
  console.log("analyze");
  const mergedLines: Line[] = [];

  const lines = raw
    .replaceAll("\r", "")
    .split("\n")
    .map((li) => {
      const timeStampStartIndex = li.indexOf("[");
      const timeStampEndIndex = li.indexOf("]");
      const timeStamp = timeAnalyzer(
        li.slice(timeStampStartIndex + 1, timeStampEndIndex)
      );
      const lyricText = li.slice(timeStampEndIndex + 1).trim();
      return { text: [lyricText], start: timeStamp, active: false };
    });

  for (const li of lines) {
    const sameLineIndex = mergedLines.findIndex(
      (_li) => _li.start === li.start
    );
    if (sameLineIndex !== -1) {
      mergedLines[sameLineIndex].text = [
        ...mergedLines[sameLineIndex].text,
        ...li.text,
      ];
    } else {
      mergedLines.push(li);
    }
  }
  return mergedLines;
};

/**
 *
 * @param rawData
 * @param currTime
 * @param activeOffsetY 不支持动态修改
 * @returns
 */
export const useLyric = (
  rawData: string,
  currTime: number,
  activeOffsetY?: (containerHeight: number) => number
) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [activeLine, setActiveLine] = useState<number>();

  const clearCache = useCallback(() => {
    setLines(undefined);
    setActiveLine(undefined);
  }, []);

  useEffect(() => {
    if (activeLine !== undefined) {
      const container = document.getElementById("lyric-container");
      const activeLine = document.getElementsByClassName(
        "line-active"
      )?.[0] as HTMLElement;
      if (!container || !activeLine) return;
      const offset =
        activeOffsetY?.(container.clientHeight) || container.clientHeight / 2;
      container.scrollTo({
        top: activeLine.offsetTop - offset,
        behavior: "smooth",
      });
    }
  }, [activeLine]);

  useEffect(() => {
    if (rawData) setLines(analyzeRawLyricToLine(rawData));
    else clearCache();
  }, [rawData]);

  const linesWithState = useMemo(() => {
    return lines?.map((li, index) => {
      const next = lines?.[index + 1];
      const active = currTime > li.start && (!next || currTime < next.start);
      if (active) setActiveLine(index);
      return {
        ...li,
        active: active,
      };
    });
  }, [lines, currTime]);

  return { lines: linesWithState };
};
