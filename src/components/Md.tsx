import React, { HTMLProps } from "react";
import Markdown from "markdown-to-jsx";

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
}

export const Md: React.FC<MdProps> = ({ md }) => (
  <article className="prose prose-blue">
    <Markdown options={{ overrides: { a: CustomA } }}>{md}</Markdown>
  </article>
);