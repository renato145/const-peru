import { DataItemArticle, DataItemIntro } from "./store";

export const mdFormatIntro = ({ title, text, footnotes }: DataItemIntro) => {
  let out = [
    `# ${title}`,
    text,
    ...footnotes.map(({ ref, text }) => `[^${ref}]: ${text}`),
  ];
  return out.join("\n\n");
};

export const mdFormatArticle = ({ article, title, text, footnotes }: DataItemArticle) => {
  let out = [
    `# Artículo ${article}`,
    text,
    ...footnotes.map(({ ref, text }) => `[^${ref}]: ${text}`),
  ];
  return out.join("\n\n");
};
