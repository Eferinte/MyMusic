import { ReactNode } from "react";

export const TestWrap = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <div
      style={{
        position: "fixed",
        left: "200px",
        top: "200px",
        width: "calc(100vw - 400px)",
        height: "600px",
      }}
    >
      {children}
    </div>
  );
};
