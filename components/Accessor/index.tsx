import { ReactNode, useCallback, useEffect, useState } from "react";
import "./index.css";
import { axiosInstance, request } from "../../utils/request";
import { getCookies, setCookies } from "../../utils/cookies";
import { getClassName } from "../../utils/format";

interface Props {
  children: ReactNode;
}

const Accessor = (props: Props) => {
  const { children } = props;
  const [accessed, setAccessed] = useState<boolean>();
  const [inAccessing, setInAccessing] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState<string>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const token = getCookies("token");
    setAccessed(!!token);
  }, []);

  // TODO 登录成功动画
  const welcome = useCallback(() => {}, []);

  // TODO 添加输入框
  const tryAccess = useCallback(
    async (accessCode: string) => {
      try {
        const res = await axiosInstance.post(
          "authorization",
          { access_code: accessCode },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        if (res.data.data && res.data.code === 2000) {
          setCookies("token", res.data.data);
          setAccessed(true);
        } else {
          setAccessCode("");
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 300);
        }
      } catch (error) {
        console.log("error", error);
        setAccessed(false);
        welcome();
      }
    },
    [welcome]
  );

  if (accessed) return children;
  return (
    <>
      <div
        id="accessor"
        style={inAccessing ? { opacity: 0 } : {}}
        onClick={() => {
          setInAccessing(true);
          document.getElementById("access-input").focus();
        }}
      >
        <div id="inner-accessor"></div>
        <div id="inner-accessor-2"></div>
      </div>
      <div
        onClick={() => setInAccessing(false)}
        className={getClassName("mask", inAccessing)}
      >
        <div
          className={
            error ? "circle-error" : getClassName("circle", inAccessing)
          }
        ></div>
        <div className={error ? "input-container-error" : "input-container"}>
          <input
            value={accessCode}
            onChange={(e) =>
              setAccessCode((e.target as HTMLInputElement).value)
            }
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                // console.log(e.target.value);
                tryAccess((e.target as HTMLInputElement).value);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            id="access-input"
          />
        </div>
      </div>
    </>
  );
};

export default Accessor;
