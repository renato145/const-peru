import create from "zustand";
import names from "./data/names.json";
import intro from "./data/intro.json";
import articles from "./data/articles.json";
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

interface ChapterInfo extends NameInfo, FootNotes {
}

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
  nArticles: () => number;
  getArticle: (i: number) => DataItemArticle;
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

export const useStore = create<State>((set, get) => ({
  intro,
  articles: formatArticles(articles),
  nArticles: () => get().articles.length,
  getArticle: (i) => get().articles[i - 1],
}));
