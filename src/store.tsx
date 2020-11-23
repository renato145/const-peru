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

export interface DataItemArticle extends FootNotes {
  title: NameInfo;
  chapter: NameInfo | null;
  article: number;
  name: string;
  text: string;
}

export type State = {
  intro: DataItemIntro;
  articles: DataItemArticle[];
  getArticle: (i: number) => DataItemArticle;
};

const formatArticles: (data: typeof articles) => DataItemArticle[] = (data) => {
  return data.map(({ title, chapter, ...props }) => {
    const names_data = names[title - 1];

    return {
      title: { i: title, name: names_data.name },
      chapter: chapter
        ? { i: chapter, name: names_data.chapters[chapter - 1].name }
        : null,
      ...props,
    };
  });
};

export const useStore = create<State>((set, get) => ({
  intro,
  articles: formatArticles(articles),
  getArticle: (i) => get().articles[i - 1],
}));
