import {
  FC,
  ReactElement,
  ReactNode,
  Ref,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./index.css";
import useGetState from "../../hooks/useGetState";
import { clamp, sortChange } from "../../utils/format";

interface Props<T> {
  children: ReactElement[];
  list: T[];
  setList: (newList: T[]) => void;
  rowHeight: number;
}

/**
 * 仅在每个元素的高度相同时能正确处理
 * @param porps
 * @returns
 */
export default function DragSorter<T>(porps: Props<T>) {
  const { children, list, setList, rowHeight } = porps;
  const [nextSort, setNextSort] = useState<T[]>(list);
  // 正在拖拽的元素的index
  const [dragIndex, setDragIndex, getDragIndex] = useGetState<number>();
  const [startCenterY, setStartCenterY, getStartCenterY] =
    useGetState<number>();
  const [targetIndex, setTargetIndex, getTargetIndex] = useGetState<number>();

  const handleStartDrag = useCallback((ev: DragEvent, index: number) => {
    ev.dataTransfer.setData("text/plain", "Text to drag");
    const targetBCR = (
      ev.currentTarget as HTMLDivElement
    ).getBoundingClientRect();
    const centerY = targetBCR.top + targetBCR.height / 2;
    console.log("start=", centerY);
    setStartCenterY(centerY);
    setDragIndex(index);
  }, []);

  const handleDragging = useCallback(
    (ev: MouseEvent, index: number) => {
      const mouseY = ev.clientY;
      const offset = ((mouseY - getStartCenterY()) / rowHeight) | 0;
      console.log("offset=", offset);
      const targetIndex = dragIndex + offset;
      setTargetIndex(clamp(targetIndex, 0, list.length - 1));
    },
    [getDragIndex, dragIndex, getStartCenterY, rowHeight, list]
  );

  const handleApplyTarget = useCallback(() => {
    const targetList = sortChange(list, getDragIndex(), getTargetIndex());
    console.log("target=", targetList);
    setList(targetList);
    setTargetIndex(undefined);
  }, [setList, list]);

  const getPreviewClassName = useCallback(
    (index: number) => {
      if (index !== targetIndex || index === dragIndex) return "";
      // 非拖拽index的目标index
      if (dragIndex < targetIndex) return "-bottom";
      if (dragIndex > targetIndex) return "-top";
    },
    [dragIndex, targetIndex]
  );

  const newList = children.map((origin, index) =>
    cloneElement(origin, {
      className: `${origin.props.className} drag-sort-item${getPreviewClassName(
        index
      )}`,
      draggable: true,
      onDragStart: (ev) => {
        handleStartDrag(ev, index);
        origin.props.onDragStart?.(ev);
      },
      onDrag: (ev) => {
        handleDragging(ev, index);
        origin.props.onDrag?.(ev);
      },
      onDragEnd: (ev) => {
        handleApplyTarget();
        origin.props.onDragEnd?.(ev);
      },
    })
  );

  return <>{newList}</>;
}
