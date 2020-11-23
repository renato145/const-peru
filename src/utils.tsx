import { DataItemArticle, DataItemIntro } from "./store";

export const mdFormatIntro = ({ title, text, footnotes }: DataItemIntro) => {
  let out = [
    `# ${title}`,
    text,
    ...footnotes.map(({ ref, text }) => `[^${ref}]: ${text}`),
  ];
  return out.join("\n\n");
};

export const mdFormatArticle = ({
  title,
  chapter,
  article,
  name,
  text,
  footnotes,
}: DataItemArticle) => {
  let out = [`#### Título ${title.i}: ${title.name}`];
  if (chapter !== null) {
    out.push(`#### Capítulo ${chapter?.i}: ${chapter?.name}`);
}

  out.push(...[
    `## Artículo ${article}: ${name ?? ''}`,
    text,
    ...footnotes.map(({ ref, text }) => `[^${ref}]: ${text}`),
  ]);

  return out.join("\n\n");
};
