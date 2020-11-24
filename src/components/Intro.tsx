import React, { useCallback } from "react";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { useStore, State } from "../store";
import { mdFormatIntro } from "../utils";
import { FootLinks } from "./FootLinks";
import { Md } from "./Md";

const selector = (state: State) => state.intro;

export const Intro: React.FC = () => {
  const data = useStore(selector);
  const md = mdFormatIntro(data);
  const [firstLink, firstArticle] = useStore(
    useCallback((state) => state.getFirstLink(), [])
  );
  const [lastLink, lastArticle] = useStore(useCallback((state) => state.getLastLink(), []));

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
