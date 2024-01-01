import { useCallback } from "react";
import { axiosInstance } from "../../utils/request";
import { upload } from "../../utils/uploader";
import "./index.css";

interface Props {
  updateList: () => void;
}

const Uploader = (props: Props) => {
  const { updateList } = props;

  const handleUpload = useCallback(() => {
    upload((e: any) => {
      if (e.target.files[0]) {
        // 考虑获取音频信息  https://github.com/aadsm/jsmediatags
        const fullName: string = e.target.files[0].name;
        const dotIndex: number = fullName.lastIndexOf(".");
        if (dotIndex !== -1) {
          axiosInstance
            .post(
              "upload",
              {
                name: fullName.slice(0, dotIndex),
                suffix: fullName.slice(dotIndex + 1),
                data: e.target.files[0],
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              if (res.data.data) {
                updateList();
              }
            });
        } else {
          throw Error("illegal file name");
        }
      }
    });
  }, []);

  return (
    <div
      id="uploader"
      //   style={{ position: "absolute", bottom: 20 }}
      onClick={handleUpload}
    >
      UPLOAD
    </div>
  );
};
export default Uploader;
