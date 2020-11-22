import React from "react";
import data from "../data/intro.json";
import { mdFormatIntro } from "../utils";
import { Md } from "./Md";

export const Intro: React.FC = () => {
  const md = mdFormatIntro(data);

  return (
    <div>
      <Md md={md} />
    </div>
  );
};
