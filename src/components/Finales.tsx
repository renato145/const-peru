import React, { useCallback } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Paths } from "../App";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { State, useStore } from "../store";
import { mdFormatEndSection } from "../utils";
import { FootLinks } from "./FootLinks";
import { ArticleMd } from "./Md";

const lastLinkSelector = (state: State) => state.getLastLink();

export const Finales: React.FC = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = +idParam;
  const endSection = useStore(
    useCallback((state) => state.getEndSection(id), [id])
  );
  const [prevLink, prevEndSection] = useStore(
    useCallback((state) => state.getPrevEndSectionLink(id), [id])
  );
  const [nextLink, nextEndSection] = useStore(
    useCallback((state) => state.getNextEndSectionLink(id), [id])
  );
  const [lastLink, lastArticle] = useStore(lastLinkSelector);
  const md = endSection ? mdFormatEndSection(endSection) : null;

  const leftLink = prevLink ?? lastLink;
  const rightLink = nextLink ?? Paths.home;

  useOnKeyGoTo({ key: "ArrowLeft", to: leftLink });
  useOnKeyGoTo({ key: "ArrowRight", to: rightLink });

  return md ? (
    <div className="prose">
      <ArticleMd md={md} />
      <FootLinks
        prevLink={leftLink}
        prevText={
          prevLink ? `←Finales ${prevEndSection}` : `←Artículo ${lastArticle}`
        }
        nextLink={rightLink}
        nextText={nextLink ? `Finales ${nextEndSection}→` : 'Preámbulo→' }
      />
    </div>
  ) : (
    <Redirect to={Paths.index} />
  );
};
