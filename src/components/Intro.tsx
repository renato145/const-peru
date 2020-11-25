import React from "react";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { useStore, State } from "../store";
import { mdFormatIntro } from "../utils";
import { FootLinks } from "./FootLinks";
import { ArticleMd } from "./Md";

const selector = (state: State) => state.intro;
const selectFirstLink = (state: State) => state.getFirstLink();
const selectLastLink = (state: State) => state.getLastEndSectionLink();


export const Intro: React.FC = () => {
  const data = useStore(selector);
  const md = mdFormatIntro(data);
  const [firstLink, firstArticle] = useStore(selectFirstLink);
  const [lastLink, lastEndSection] = useStore(selectLastLink);
  useOnKeyGoTo({ key: "ArrowLeft", to: lastLink });
  useOnKeyGoTo({ key: "ArrowRight", to: firstLink });

  return (
    <div>
      <ArticleMd md={md} />
      <FootLinks
        prevLink={lastLink}
        prevText={`←Finales ${lastEndSection}`}
        nextLink={firstLink}
        nextText={`Artículo ${firstArticle}→`}
      />
    </div>
  );
};
