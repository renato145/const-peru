import { DiscussionEmbed } from "disqus-react";
import React from "react";
import { Paths } from "../App";
import { ArticleMd } from "./Md";

export const About: React.FC = () => {
  const md = `#About

  Esta página ha sido desarrollada con el objetivo de analizar los reclamos
  con respecto a la actual constitución del Perú.

  El código fuente se encuentra en: https://github.com/renato145/const-peru
  
  <br/>
  Cualquier sugerencias pueden dejarla en los comentarios:
  `;

  const discussConfig = {
    url: `${Paths.url}${Paths.about}`,
    identifier: "about_0",
    title: "About",
    language: "es_MX",
  };

  return (
    <div>
      <ArticleMd md={md} />
      <div className="mt-8">
        <DiscussionEmbed shortname="const-peru" config={discussConfig} />
      </div>
    </div>
  );
};
