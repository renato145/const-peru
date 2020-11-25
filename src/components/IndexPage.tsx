import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Paths } from "../App";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { State, useStore } from "../store";
import { mdFormatFootnotes } from "../utils";
import { Md } from "./Md";

const selector = (state: State) => state.indexData;
const selectFirstLink = (state: State) => state.getFirstLink();
const SelectLastLink = (state: State) => state.getLastLink();
const selectGetArticleLink = (state: State) => state.getArticleLink;

export const IndexPage: React.FC = () => {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);
  const { indexData, footnotes } = useStore(selector);
  const [firstLink] = useStore(selectFirstLink);
  const [lastLink] = useStore(SelectLastLink);
  const getArticleLink = useStore(selectGetArticleLink);
  useOnKeyGoTo({ key: "ArrowLeft", to: lastLink });
  useOnKeyGoTo({ key: "ArrowRight", to: firstLink });
  const searchTitle = searchParams.get("titulo");
  const searchChapter = searchParams.get("capitulo");
  const showBack = searchTitle || searchChapter;

  return (
    <div className="prose">
      <h1>Indice</h1>
      {showBack && <Link to={Paths.index}>Ver todo</Link>}
      {indexData
        .filter(({ i }) => (searchTitle ? i === +searchTitle : true))
        .map(({ title, chapters, i }, idx) => (
          <div key={i}>
            <Link to={`${Paths.index}?titulo=${i}`}>
              <Md md={`## Título ${i}: ${title}`} />
            </Link>
            {chapters
              .filter(({ i }) => (searchChapter ? i === +searchChapter : true))
              .map(({ chapter, articles, i: j }) => (
                <div key={`${i}-${j}`} className="ml-4">
                  {chapter && (
                    <Link to={`${Paths.index}?titulo=${i}&capitulo=${j}`}>
                      <Md md={`### Capítulo ${j}: ${chapter}`} />
                    </Link>
                  )}
                  {articles.map(({ article, name }) => (
                    <div key={article} className="ml-4">
                      <Link to={"" + getArticleLink(article)}>
                        <Md
                          md={`#### Artículo ${article} ${
                            name ? `: ${name}` : ""
                          }`}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        ))}
      <div className="mt-12">
        <Md md={mdFormatFootnotes(footnotes)} />
      </div>
    </div>
  );
};
