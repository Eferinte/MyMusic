import { ReactNode, useCallback, useEffect, useState } from "react";
import "./index.css";
import { axiosInstance, request } from "../../utils/request";
import { getCookies, setCookies } from "../../utils/cookies";

interface Props {
  children: ReactNode;
}

const Accessor = (props: Props) => {
  const { children } = props;
  const [accessed, setAccessed] = useState<boolean>();

  useEffect(() => {
    const token = getCookies("token");
    setAccessed(!!token);
  }, []);

  // TODO 登录成功动画
  const welcome = useCallback(() => {}, []);

  // TODO 添加输入框
  const tryAccess = useCallback(async () => {
    try {
      const res = await axiosInstance.post(
        "authorization",
        { access_code: "BDY54lxp@mymusic" },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      if (res.data.data && res.data.code === 2000) {
        setCookies("token", res.data.data);
        setAccessed(true);
      }
    } catch (error) {
      console.log("error", error);
      setAccessed(false);
      welcome();
    }
  }, [welcome]);

  if (accessed) return children;
  return (
    <div id="accessor" onClick={tryAccess}>
      TRY ACCESS
    </div>
  );
};

export default Accessor;
