import React from "react";
import { NavLink } from "react-router-dom";
import { Paths } from "../App";

const Link: React.FC<{ to: Paths }> = ({ to, children }) => (
  <NavLink
    className="px-4 md:px-6 py-1 rounded hover:bg-gray-200 transition md:text-lg font-medium"
    to={to}
  >
    {children}
  </NavLink>
);

export const Navigation: React.FC = () => (
  <div className="flex px-2 divide-x-2 bg-gray-100">
    <Link to={Paths.home}>Inicio</Link>
    <Link to={Paths.index}>Indice</Link>
    <Link to={Paths.about}>About</Link>
  </div>
);
