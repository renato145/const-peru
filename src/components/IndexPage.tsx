import React from "react";
import { Link } from "react-router-dom";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { State, useStore } from "../store";
import { mdFormatFootnotes } from "../utils";
import { Md } from "./Md";

const selector = (state: State) => state.indexData;
const selectFirstLink = (state: State) => state.getFirstLink();
const SelectLastLink = (state: State) => state.getLastLink();
const selectGetArticleLink = (state: State) => state.getArticleLink;

export const IndexPage: React.FC = () => {
  const { indexData, footnotes } = useStore(selector);
  const [firstLink] = useStore(selectFirstLink);
  const [lastLink] = useStore(SelectLastLink);
  const getArticleLink = useStore(selectGetArticleLink);
  useOnKeyGoTo({ key: "ArrowLeft", to: lastLink });
  useOnKeyGoTo({ key: "ArrowRight", to: firstLink });

  return (
    <div className="prose prose-blue">
      <h1>Indice</h1>
      {indexData.map(({ title, chapters }, i) => (
        <div key={i}>
          <Md md={`## Título ${i + 1}: ${title}`} />
          {chapters.map(({ chapter, articles }, j) => (
            <div key={`${i}-${j}`}>
              {chapter && <Md md={`### Capítulo ${j + 1}: ${chapter}`} />}
              {articles.map(({ article, name }) => (
                <Link
                  key={article}
                  to={""+getArticleLink(article)}
                >
                <Md
                  md={`#### Artículo ${article} ${name ? `: ${name}` : ""}`}
                  />
                  </Link>
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
