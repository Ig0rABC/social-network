import React from "react";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";

const LIBRARIES = [
  "axios",
  "react-redux",
  "react-router-dom",
  "redux-thunk",
  "react-intl",
  "redux-devtools-extension"
];

const Footer: React.FC = () => {

  const libraries = LIBRARIES.map(lib => <><a target="_blank" href={"https://npmjs.com/package/" + lib}>{lib}</a>  </>);

  return <div style={{ textAlign: "center" }}>
    <div>
      <FormattedMessage id="credits.devoloped-by" /> <NavLink to="/users/1"><FormattedMessage id="credits.my-name" /></NavLink> <FormattedMessage id="credits.in" /> React, Redux, <a target="_blank" href="https://ant.design">Ant-Design</a>
    </div>
    <div>
      <FormattedMessage id="credits.used-libraries" />: {libraries}
    </div>
  </div>
}

export default Footer;