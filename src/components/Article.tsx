import React from "react";
import { useParams } from "react-router-dom";
import { DataItemArticle } from "../store";
import { mdFormatArticle } from "../utils";
import { Md } from "./Md";

interface Props {
  data: DataItemArticle[];
}

export const Article: React.FC<Props> = ({ data }) => {
  const { id } = useParams<{ id: string }>();
  const article = data.filter(d => d.article === +id)[0];
  const md = mdFormatArticle(article);

  return (
    <div>
      <Md md={md} />
    </div>
  );
};
