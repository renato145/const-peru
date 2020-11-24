import { useEffect } from "react";

interface Props {
  key: string;
  callback: () => void;
}

export const useOnKeyDown: (props: Props) => void = ({ key, callback }) => {
  useEffect(() => {
    const f = (ev: { key: string }) => {
      if (ev.key === key) callback();
    };

    document.addEventListener("keydown", f);
    return () => void document.removeEventListener("keydown", f);
  }, [key, callback]);
};
