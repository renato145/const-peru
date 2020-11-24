import { DataItemArticle, DataItemIntro, FootNote } from "./store";

export const mdFormatFootnotes = (footnotes: FootNote[]) =>
  footnotes.map(({ ref, text }) => `[^${ref}]: *${text}*`).join("\n\n");

export const mdFormatIntro = ({ title, text, footnotes }: DataItemIntro) => {
  let out = [`# ${title}`, text, mdFormatFootnotes(footnotes)];
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

  const chapterFootnotes = chapter?.footnotes ?? [];
  const allFootnotes = chapterFootnotes.concat(footnotes);

  out.push(
    ...[
      `## Artículo ${article}${name ? ": " + name : ""}`,
      text,
      mdFormatFootnotes(allFootnotes),
    ]
  );

  return out.join("\n\n");
};
