import React from "react";
import { HashRouter, NavLink, Route, Switch } from "react-router-dom";
import { Articles } from "./components/Articles";
import { Intro } from "./components/Intro";
import { Article } from "./components/Article";
import articles from "./data/articles.json";

export enum Paths {
  home = "/",
  articles = "/articulos",
  article = "/articulos/:id",
}

export const AppContent: React.FC = () => {
  return (
    <div>
      <div>
        <NavLink to={Paths.home}>Inicio</NavLink>
        <NavLink to={Paths.articles}>Artículos</NavLink>
      </div>
      <div className="mt-6">
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
