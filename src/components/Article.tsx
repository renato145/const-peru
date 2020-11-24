import React, { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Paths } from "../App";
import { useStore, State } from "../store";
import { mdFormatArticle } from "../utils";
import { Md } from "./Md";

const nArticlesSelector = (state: State) => state.nArticles();

export const Article: React.FC = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = +idParam;
  const article = useStore(useCallback((state) => state.getArticle(id), [id]));
  const nArticles = useStore(nArticlesSelector);
  const prevArticle = id > 1 ? id - 1 : null;
  const nextArticle = id < nArticles ? id + 1 : null;
  const md = mdFormatArticle(article);

  return (
    <div>
      <Md md={md} />
      <div className="max-w-prose mt-4 flex justify-between">
        <div>
          {prevArticle && (
            <Link
              className="justify-self-end"
              to={`${Paths.articles}/${prevArticle}`}
            >{`←Artículo ${prevArticle}`}</Link>
          )}
        </div>
        <div>
          {nextArticle && (
            <Link
              className="justify-self-end"
              to={`${Paths.articles}/${nextArticle}`}
            >{`Artículo ${nextArticle}→`}</Link>
          )}
        </div>
      </div>
    </div>
  );
};
