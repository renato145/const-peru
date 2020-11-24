import React from "react";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { useStore, State } from "../store";
import { mdFormatIntro } from "../utils";
import { FootLinks } from "./FootLinks";
import { Md } from "./Md";

const selector = (state: State) => state.intro;
const firstLinkSelector = (state: State) => state.getFirstLink();
const lastLinkSelector = (state: State) => state.getLastLink();


export const Intro: React.FC = () => {
  const data = useStore(selector);
  const md = mdFormatIntro(data);
  const [firstLink, firstArticle] = useStore(firstLinkSelector);
  const [lastLink, lastArticle] = useStore(lastLinkSelector);
  useOnKeyGoTo({ key: "ArrowLeft", to: lastLink });
  useOnKeyGoTo({ key: "ArrowRight", to: firstLink });

  return (
    <div>
      <Md md={md} />
      <FootLinks
        prevLink={firstLink}
        prevText={`←Artículo ${firstArticle}`}
        nextLink={lastLink}
        nextText={`Artículo ${lastArticle}→`}
      />
    </div>
  );
};
