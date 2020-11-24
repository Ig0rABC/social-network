import React from "react";
import { FormattedMessage } from "react-intl";

const Preloader: React.FC = () => {
  return <>
    <FormattedMessage
      id="loading"
      defaultMessage="loading"
      description="loading on preloader"
    />..
  </>
}

export default Preloader;