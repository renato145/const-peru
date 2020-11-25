import React, { useCallback } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { Paths } from "../App";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { useStore } from "../store";
import { mdFormatArticle } from "../utils";
import { FootLinks } from "./FootLinks";
import { ArticleMd, Md } from "./Md";

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
    <div className="prose">
      <Link to={`${Paths.index}?titulo=${article?.title.i}`}>
        <Md md={`#### Título ${article?.title.i}: ${article?.title.name}`} />
      </Link>
      <Link to={`${Paths.index}?titulo=${article?.chapter?.i}`}>
        <Md
          overrides={{
            h4: { props: { style: { marginTop: 0, marginBottom: "-2em" } } },
          }}
          md={`#### Capítulo ${article?.chapter?.i}: ${article?.chapter?.name}`}
        />
      </Link>
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
