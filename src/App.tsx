import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Articles } from "./components/Articles";
import { Intro } from "./components/Intro";
import { Article } from "./components/Article";
import { Navigation } from "./components/Navigation";
import { IndexPage } from "./components/IndexPage";
import { useOnKeyGoToIndex } from "./hooks/useOnKeyGoToIndex";

export enum Paths {
  home = "/",
  index = "/indice",
  articles = "/articulos",
  article = "/articulos/:id",
}

export const AppContent: React.FC = () => {
  useOnKeyGoToIndex({key: "ArrowUp" ,goBackKey: "ArrowDown"});

  return (
    <div className="container md:max-w-screen-md mx-auto px-2">
      <Navigation />
      <div className="mt-4">
        <Switch>
          <Route exact path={Paths.home}>
            <Intro />
          </Route>
          <Route exact path={Paths.index}>
            <IndexPage />
          </Route>
          <Route exact path={Paths.articles}>
            <Articles />
          </Route>
          <Route path={Paths.article}>
            <Article />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export const App: React.FC = () => (
  <HashRouter basename="/">
    <AppContent />
  </HashRouter>
);
