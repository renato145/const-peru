import React, { HTMLProps } from "react";
import Markdown, { MarkdownToJSX } from "markdown-to-jsx";

const CustomA: React.FC<HTMLProps<HTMLAnchorElement>> = ({
  children,
  href,
  ...props
}) =>
  href?.startsWith("#") ? (
    <>{children}</>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );

interface MdProps {
  md: string;
  overrides?: MarkdownToJSX.Overrides;
}

export const Md: React.FC<MdProps> = ({ md, overrides }) => (
  <Markdown
    options={{
      overrides: overrides ?? {
        a: CustomA,
        footer: {
          props: {
            className:
              "text-sm text-gray-600 border-gray-300 border-t pt-1 px-1",
          },
        },
      },
    }}
  >
    {md}
  </Markdown>
);

export const ArticleMd: React.FC<MdProps> = ({ md, overrides }) => (
  <article className="prose prose-blue">
    <Md md={md} overrides={overrides} />
  </article>
);
