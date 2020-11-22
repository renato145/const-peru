interface FootNotes {
  footnotes: { ref: number; text: string }[];
}

interface DataItemIntro extends FootNotes {
  title: string;
  text: string;
}

export const mdFormatIntro = ({ title, text, footnotes }: DataItemIntro) => {
  let out = [
    `# ${title}`,
    text,
    ...footnotes.map(({ ref, text }) => `[^${ref}]: ${text}`),
  ];
  return out.join("\n\n");
};

export interface DataItemArticle extends FootNotes {
  title: number
  chapter: number | null;
  article: number;
  name: string;
  text: string;
}

export const mdFormatArticle = ({ article, title, text, footnotes }: DataItemArticle) => {
  let out = [
    `# Artículo ${article}`,
    text,
    ...footnotes.map(({ ref, text }) => `[^${ref}]: ${text}`),
  ];
  return out.join("\n\n");
};
