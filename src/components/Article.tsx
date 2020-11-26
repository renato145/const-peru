import React, { useCallback } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { DiscussionEmbed } from "disqus-react";
import { Paths } from "../App";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { State, useStore } from "../store";
import { mdFormatArticle } from "../utils";
import { FootLinks } from "./FootLinks";
import { ArticleMd, Md } from "./Md";

const selectFirstLink = (state: State) => state.getFirstEndSectionLink();

export const Article: React.FC = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = +idParam;
  const article = useStore(useCallback((state) => state.getArticle(id), [id]));
  const link = useStore(useCallback((state) => state.getArticleLink(id), [id]));
  const [prevLink, prevArticle] = useStore(
    useCallback((state) => state.getPrevLink(id), [id])
  );
  const [nextLink, nextArticle] = useStore(
    useCallback((state) => state.getNextLink(id), [id])
  );
  const [firstLink] = useStore(selectFirstLink);
  const md = article ? mdFormatArticle(article) : null;

  const leftLink = prevLink ?? Paths.home;
  const rightLink = nextLink ?? firstLink;

  const discussConfig = {
    url: `${Paths.url}/${link}`,
    identifier: `article_${id}`,
    title: `Artículo ${id}`,
    language: 'es_MX',
  };

  useOnKeyGoTo({ key: "ArrowLeft", to: leftLink });
  useOnKeyGoTo({ key: "ArrowRight", to: rightLink });

  return md ? (
    <div>
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
          prevLink={leftLink}
          prevText={prevLink ? `←Artículo ${prevArticle}` : "←Preámbulo"}
          nextLink={rightLink}
          nextText={nextLink ? `Artículo ${nextArticle}→` : "Finales 1→"}
        />
      </div>
      <div className="mt-8">
        <DiscussionEmbed shortname="const-peru" config={discussConfig} />
      </div>
    </div>
  ) : (
    <Redirect to={Paths.index} />
  );
};
