import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Articles } from "./components/Articles";
import { Intro } from "./components/Intro";
import { Article } from "./components/Article";
import articles from "./data/articles.json";
import { Navigation } from "./components/Navigation";

export enum Paths {
  home = "/",
  articles = "/articulos",
  article = "/articulos/:id",
}

export const AppContent: React.FC = () => {
  return (
    <div className="container md:max-w-screen-md mx-auto px-2">
      <Navigation />
      <div className="mt-4">
        <Switch>
          <Route exact path={Paths.home}>
            <Intro />
          </Route>
          <Route exact path={Paths.articles}>
            <Articles n={articles.length} />
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
