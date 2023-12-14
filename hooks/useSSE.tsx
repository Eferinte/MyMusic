import { useEffect, useState } from "react";
import { NativeEventSource, EventSourcePolyfill } from "event-source-polyfill";

export const useSSE = (
  url: string,
  onMessage?: (event: MessageEvent<any>) => void,
  onError?: (event: MessageEvent<any>) => void,
  onOpen?: (event: MessageEvent<any>) => void
) => {
  const [eventSource, setEventSource] = useState<EventSource>();

  document.cookie =
    "yourCookieName=yourCookieValue; path=/; domain=localhost; secure; SameSite=None";

  useEffect(() => {
    const _eventSource = new EventSource("" + url, { withCredentials: true });
    // const _eventSource = new EventSourcePolyfill("" + url);
    setEventSource(_eventSource);
    if (onMessage) _eventSource.addEventListener("message", onMessage);
    if (onError) _eventSource.addEventListener("error", onError);
    if (onOpen) _eventSource.addEventListener("open", onOpen);
  }, [url]);

  return { eventSource };
};
