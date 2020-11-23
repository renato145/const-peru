import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store";
import { mdFormatArticle } from "../utils";
import { Md } from "./Md";

export const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = useStore(useCallback((state) => state.getArticle(+id), [id]));
  const md = mdFormatArticle(article);

  return (
    <div>
      <Md md={md} />
    </div>
  );
};
