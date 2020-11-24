import React, { useCallback } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Paths } from "../App";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { useStore } from "../store";
import { mdFormatArticle } from "../utils";
import { FootLinks } from "./FootLinks";
import { ArticleMd } from "./Md";

export const Article: React.FC = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = +idParam;
  const article = useStore(useCallback((state) => state.getArticle(id), [id]));
  const [prevLink, prevArticle] = useStore(
    useCallback((state) => state.getPrevLink(id), [id])
  );
  const [nextLink, nextArticle] = useStore(
    useCallback((state) => state.getNextLink(id), [id])
  );
  const md = article ? mdFormatArticle(article) : null;

  useOnKeyGoTo({ key: "ArrowLeft", to: prevLink, fallback: Paths.home });
  useOnKeyGoTo({ key: "ArrowRight", to: nextLink, fallback: Paths.home });

  return md ? (
    <div>
      <ArticleMd md={md} />
      <FootLinks
        prevLink={prevLink}
        prevText={`←Artículo ${prevArticle}`}
        nextLink={nextLink}
        nextText={`Artículo ${nextArticle}→`}
      />
    </div>
  ) : (
    <Redirect to={Paths.index} />
  );
};
