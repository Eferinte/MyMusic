export const formatMinute = (seconds: number): string => {
  return `${(Math.floor(seconds / 60) + "").padStart(2, "0")}:${(
    Math.floor(seconds % 60) + ""
  ).padStart(2, "0")}`;
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 将一个数组的originIndex处的元素移动到targetIndex处，剩余元素的顺序保持不变
 * @param list
 * @param originIndex
 * @param targetIndex
 * @returns
 */
export const sortChange = <T>(
  list: T[],
  originIndex: number,
  targetIndex: number
): T[] => {
  console.log("before sort", list);
  console.log("from ", originIndex, " to ", targetIndex);
  if (originIndex === targetIndex) return list;
  if (originIndex < targetIndex) {
    const head = list.slice(0, originIndex);
    const moveSubList = list.slice(originIndex + 1, targetIndex + 1);
    const tail = list.slice(targetIndex + 1);
    const sorted = [...head, ...moveSubList, list[originIndex], ...tail];
    console.log("after sort", sorted);
    return sorted;
  } else {
    const head = list.slice(0, targetIndex);
    const moveSubList = list.slice(targetIndex, originIndex);
    const tail = list.slice(originIndex + 1);
    const sorted = [...head, list[originIndex], ...moveSubList, ...tail];
    console.log("after sort", sorted);
    return sorted;
  }
};
