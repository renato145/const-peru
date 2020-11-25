import create from "zustand";
import { Paths } from "./App";
import { group } from "d3";
import names from "./data/names.json";
import intro from "./data/intro.json";
import articles from "./data/articles.json";
import endSections from "./data/end_sections.json";

export enum FootNoteType {
  Intro = "intro",
  ArticleName = "article_name",
  ArticleText = "article_text",
  EndSection = "end_section",
  Chapter = "chapter",
}
export interface FootNote {
  ref: number;
  text: string;
  typ: string;
}

export interface FootNotes {
  footnotes: FootNote[];
}

export interface DataItemIntro extends FootNotes {
  title: string;
  text: string;
}

interface NameInfo {
  i: number;
  name: string;
}

interface ChapterInfo extends NameInfo, FootNotes {}

export interface DataItemArticle extends FootNotes {
  title: NameInfo;
  chapter: ChapterInfo | null;
  article: number;
  name: string | null;
  text: string;
}

export interface DataItemEndSection extends FootNotes {
  section: number;
  text: string;
  title: string;
}

export interface DataItemIndex {
  title: string;
  chapters: {
    chapter: string | undefined;
    articles: Omit<DataItemArticle, "title" | "chapter" | "text">[];
    i: number;
  }[];
  i: number;
}

export type State = {
  intro: DataItemIntro;
  articles: DataItemArticle[];
  endSections: DataItemEndSection[];
  indexData: { indexData: DataItemIndex[] } & FootNotes;
  getNArticles: () => number;
  getArticle: (i: number) => DataItemArticle | undefined;
  getArticleLink: (i: number | null) => string | null;
  getFirstLink: () => [string | null, number];
  getLastLink: () => [string | null, number];
  getPrevLink: (i: number | null) => [string | null, number | null];
  getNextLink: (i: number | null) => [string | null, number | null];
  getNEndSections: () => number;
  getEndSection: (i: number) => DataItemEndSection | undefined;
  getEndSectionLink: (i: number | null) => string | null;
  getPrevEndSectionLink: (i: number | null) => [string | null, number | null];
  getNextEndSectionLink: (i: number | null) => [string | null, number | null];
  getFirstEndSectionLink: () => [string | null, number];
  getLastEndSectionLink: () => [string | null, number];
};

const formatArticles: (data: typeof articles) => DataItemArticle[] = (data) => {
  return data.map(({ title, chapter, ...props }) => {
    const names_data = names[title - 1];

    return {
      title: { i: title, name: names_data.name },
      chapter: chapter
        ? {
            i: chapter,
            name: names_data.chapters[chapter - 1].name,
            footnotes: names_data.chapters[chapter - 1].footnotes,
          }
        : null,
      ...props,
    };
  });
};

const formatEndSections: (data: typeof endSections) => DataItemEndSection[] = (
  data
) => {
  return data.map((o, i) => ({ section: i + 1, ...o }));
};

const formatIndexData: (
  articlesData: DataItemArticle[]
) => { indexData: DataItemIndex[] } & FootNotes = (articlesData ) => {
  const data = articlesData.map(({ text, ...props }) => props);
  const indexData = Array.from(
    group(data, (d) => d.title.name),
    ([title, items], i) => {
      const chapters = Array.from(
        group(
          items.map(({ title, ...props }) => props),
          (d) => d.chapter?.name
        ),
        ([chapter, items], i) => {
          const articles = items.map(({ chapter, ...props }) => props);
          return { chapter, articles, i: i + 1 };
        }
      );
      return { title, chapters, i: i + 1 };
    }
  );

  const footnotes = data
    .map(({ footnotes, chapter }) =>
      [footnotes, chapter ? chapter.footnotes : []].flat()
    )
    .flat()
    .filter(
      (o) =>
        o.typ === FootNoteType.Chapter || o.typ === FootNoteType.ArticleName
    );
  const uniqueFootnotes = [...new Set(footnotes)].sort((o) => o.ref);

  return { indexData, footnotes: uniqueFootnotes };
};

function fNull<T, U>(f: (props: T) => U) {
  return (props: T | null) => (props === null ? null : f(props));
}

const formatedArticles = formatArticles(articles);
const formatedEndSections = formatEndSections(endSections);
const indexData = formatIndexData(formatedArticles);

export const useStore = create<State>((set, get) => ({
  intro,
  articles: formatedArticles,
  endSections: formatedEndSections,
  indexData: indexData,
  getNArticles: () => get().articles.length,
  getArticle: (i) => get().articles[i - 1],
  getArticleLink: fNull((i) =>
    i > 0 && i <= get().getNArticles() ? `${Paths.articles}/${i}` : null
  ),
  getPrevLink: (i) => {
    return i === null ? [null, null] : [get().getArticleLink(i - 1), i - 1];
  },
  getNextLink: (i) => {
    return i === null ? [null, null] : [get().getArticleLink(i + 1), i + 1];
  },
  getFirstLink: () => [get().getArticleLink(1), 1],
  getLastLink: () => {
    const i = get().getNArticles();
    return [get().getArticleLink(i), i];
  },
  getNEndSections: () => get().endSections.length,
  getEndSection: (i) => get().endSections[i-1],
  getEndSectionLink: fNull((i) =>
    i > 0 && i <= get().getNEndSections() ? `${Paths.endSections}/${i}` : null
  ),
  getPrevEndSectionLink: (i) => {
    return i === null ? [null, null] : [get().getEndSectionLink(i - 1), i - 1];
  },
  getNextEndSectionLink: (i) => {
    return i === null ? [null, null] : [get().getEndSectionLink(i + 1), i + 1];
  },
  getFirstEndSectionLink: () => [get().getEndSectionLink(1), 1],
  getLastEndSectionLink: () => {
    const i = get().getNEndSections();
    return [get().getEndSectionLink(i), i];
  },
}));
