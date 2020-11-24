import React from "react";
import { Link } from "react-router-dom";

interface Props {
  prevLink: string | null;
  nextLink: string | null;
  prevText: string | null;
  nextText: string | null;
}

export const FootLinks: React.FC<Props> = ({
  prevLink,
  nextLink,
  prevText,
  nextText,
}) => {
  return (
    <div className="prose mt-4 flex justify-between">
      <div>
        {prevLink && (
          <Link className="justify-self-end" to={prevLink}>
            {prevText}
          </Link>
        )}
      </div>
      <div>
        {nextLink && (
          <Link className="justify-self-end" to={nextLink}>
            {nextText}
          </Link>
        )}
      </div>
    </div>
  );
};
