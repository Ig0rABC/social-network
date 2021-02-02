import React from "react";
import { FormattedMessage } from "react-intl";
import { Link, Typography } from "@material-ui/core";

const LIBRARIES = [
  "axios",
  "react-redux",
  "react-router-dom",
  "redux-thunk",
  "react-intl",
  "flat",
  "redux-devtools-extension",
];

const Footer: React.FC = () => {

  const libraries = LIBRARIES.map(lib => <><Link
    target="_blank"
    color="secondary"
    underline="hover"
    href={"https://npmjs.com/package/" + lib}
  >{lib}</Link> </>);

  const materialUI = <Link
    target="_blank"
    color="secondary"
    underline="hover"
    href="https://material-ui.com"
  >Material-UI</Link>

  const author = <Link href="/users/1" color="primary" underline="hover">
    <FormattedMessage id="credits.my-name" />
  </Link>

  return <Typography align="center">
    <p>
      <FormattedMessage id="credits.devoloped-by" /> {author} <FormattedMessage id="credits.in" /> React, Redux, TypeScript, {materialUI}
    </p>
    <p>
      <FormattedMessage id="credits.used-libraries" />: {libraries}
    </p>
  </Typography>
}

export default Footer;