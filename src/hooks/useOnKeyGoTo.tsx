import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useOnKeyDown } from "./useOnKeyDown";

interface Props {
  key: string;
  to: string | null;
  fallback?: string | null;
}

export const useOnKeyGoTo: (props: Props) => void = ({ key, to, fallback=null }) => {
  const history = useHistory();
  const callback = useCallback(() => {
    if (to) history.push(to);
    else if (fallback) history.push(fallback);
  }, [history, to, fallback]);

  useOnKeyDown({ key, callback });
};
