import React from "react";
import { NavLink } from "react-router-dom";
import { Paths } from "../App";

export const Navigation: React.FC = () => (
  <div className="flex space-x-4">
    <NavLink to={Paths.home}>Inicio</NavLink>
    <NavLink to={Paths.index}>Indice</NavLink>
    <NavLink to={Paths.articles}>Artículos</NavLink>
  </div>
);
