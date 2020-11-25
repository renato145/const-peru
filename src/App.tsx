import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Intro } from "./components/Intro";
import { Article } from "./components/Article";
import { Navigation } from "./components/Navigation";
import { IndexPage } from "./components/IndexPage";
import { Finales } from "./components/Finales";

export enum Paths {
  home = "/",
  index = "/indice",
  articles = "/articulos",
  article = "/articulos/:id",
  endSections = "/finales",
  endSection = "/finales/:id",
}

export const AppContent: React.FC = () => {
  return (
    <div className="container md:max-w-screen-md mx-auto">
      <Navigation />
      <div className="mt-4 px-2">
        <Switch>
          <Route exact path={Paths.index}>
            <IndexPage />
          </Route>
          <Route exact path={Paths.home}>
            <Intro />
          </Route>
          <Route exact path={Paths.article}>
            <Article />
          </Route>
          <Route exact path={Paths.endSection}>
            <Finales />
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
