import React from "react";
import { useOnKeyGoTo } from "../hooks/useOnKeyGoTo";
import { State, useStore } from "../store";

const firstLinkSelector = (state: State) => state.getFirstLink();
const lastLinkSelector = (state: State) => state.getLastLink();

export const IndexPage: React.FC = () => {
  const [firstLink] = useStore(firstLinkSelector);
  const [lastLink] = useStore(lastLinkSelector);

  useOnKeyGoTo({ key: "ArrowLeft", to: lastLink });
  useOnKeyGoTo({ key: "ArrowRight", to: firstLink });

  return (
    <div className="prose prose-blue">
      <h1>Indice</h1>
    </div>
  );
};
