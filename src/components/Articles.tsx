import React from "react";
import { Link } from "react-router-dom";
import { Paths } from "../App";

interface ArticlesProps {
  n: number;
}

export const Articles: React.FC<ArticlesProps> = ({ n }) => (
  <div>
    some articles will be here
    {Array(n)
      .fill(0)
      .map((_, i) => (
        <div key={i}>
          <Link to={`${Paths.articles}/${i+1}`}>Art {i+1}</Link>
        </div>
      ))}
  </div>
);
