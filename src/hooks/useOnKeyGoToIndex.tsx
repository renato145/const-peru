import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Paths } from "../App";
import { useOnKeyGoTo } from "./useOnKeyGoTo";

interface Props {
  key: string;
  goBackKey: string;
}

export const useOnKeyGoToIndex: (props: Props) => void = ({
  key,
  goBackKey,
}) => {
  const location = useLocation();
  const [lastLocation, setLastLocation] = useState(location.pathname);
  useEffect(() => {
    console.log(location.pathname);
    setLastLocation(location.pathname);
  }, [location.pathname]);
  useOnKeyGoTo({ key: key, to: Paths.index });
  useOnKeyGoTo({ key: goBackKey, to: lastLocation });
};
