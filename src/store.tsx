import create from "zustand";
// import names from "./data/names.json";
import intro from "./data/intro.json";
// import articles from "./data/articles.json";
// import end_sections from "./data/end_sections.json";

interface FootNotes {
  footnotes: { ref: number; text: string }[];
}

export interface DataItemIntro extends FootNotes {
  title: string;
  text: string;
}

export interface DataItemArticle extends FootNotes {
  title: number
  chapter: number | null;
  article: number;
  name: string;
  text: string;
}

export type State = {
  intro: DataItemIntro;
};

export const useStore = create<State>(set => ({
  intro: intro
}));
