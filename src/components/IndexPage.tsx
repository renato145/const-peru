import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Paths } from "../App";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { State, useStore } from "../store";
import { mdFormatFootnotes } from "../utils";
import { Md } from "./Md";

const selector = (state: State) => ({
  intro: state.intro,
  endSections: state.endSections,
});
const selectIndexData = (state: State) => state.indexData;
const SelectLastLink = (state: State) => state.getLastEndSectionLink();
const selectGetArticleLink = (state: State) => state.getArticleLink;
const selectGetEndSectionLink = (state: State) => state.getEndSectionLink;

export const IndexPage: React.FC = () => {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);
  const { intro, endSections } = useStore(selector);
  const { indexData, footnotes } = useStore(selectIndexData);
  const [lastLink] = useStore(SelectLastLink);
  const getArticleLink = useStore(selectGetArticleLink);
  const getEndSectionLink = useStore(selectGetEndSectionLink);
  useOnKeyGoTo({ key: "ArrowLeft", to: lastLink });
  useOnKeyGoTo({ key: "ArrowRight", to: Paths.home });
  const searchTitle = searchParams.get("titulo");
  const searchChapter = searchParams.get("capitulo");
  const showBack = searchTitle || searchChapter;

  return (
    <div className="prose">
      <h1>Indice</h1>
      {showBack && <Link to={Paths.index}>Ver todo</Link>}
      <Link to={Paths.home}>
        <Md md={`## ${intro.title}`} />
      </Link>
      {indexData
        .filter(({ i }) => (searchTitle ? i === +searchTitle : true))
        .map(({ title, chapters, i }) => (
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
        {endSections.map(({title, section}, i) => (
          <div key={i}>
            <Link to={"" + getEndSectionLink(section)}>
              <Md md={`### ${title}`} />
            </Link>
            </div>
        ))}
      <div className="mt-12">
        <Md md={mdFormatFootnotes(footnotes)} />
      </div>
    </div>
  );
};
