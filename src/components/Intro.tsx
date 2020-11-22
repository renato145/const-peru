import React from "react";
import { useStore, State } from "../store";
import { mdFormatIntro } from "../utils";
import { Md } from "./Md";

const selector = ( state: State ) => state.intro;

export const Intro: React.FC = () => {
  const data = useStore(selector);
  const md = mdFormatIntro(data);

  return (
    <div>
      <Md md={md} />
    </div>
  );
};
