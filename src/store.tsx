import create from "zustand";
import names from "./data/names.json";
import intro from "./data/intro.json";
import articles from "./data/articles.json";
import { Paths } from "./App";
// import end_sections from "./data/end_sections.json";

interface FootNotes {
  footnotes: { ref: number; text: string }[];
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

export type State = {
  intro: DataItemIntro;
  articles: DataItemArticle[];
  getNArticles: () => number;
  getArticle: (i: number) => DataItemArticle | undefined;
  getArticleLink: (i: number | null) => string | null;
  getFirstLink: () => [string | null, number];
  getLastLink: () => [string | null, number];
  getPrevLink: (i: number | null) => [string | null, number | null];
  getNextLink: (i: number | null) => [string | null, number | null];
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

function fNull<T, U>(f: (props: T) => U) {
  return (props: T | null) => (props === null ? null : f(props));
}

export const useStore = create<State>((set, get) => ({
  intro,
  articles: formatArticles(articles),
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
}));
