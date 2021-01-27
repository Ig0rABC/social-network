import React from "react";
import { useIntl } from "react-intl";
import { Spin } from "antd";

const Preloader: React.FC = () => {

  const intl = useIntl();

  return <Spin size="large"
    tip={intl.formatMessage({ id: "loading" }) + "..."}
    style={{
      position: "absolute",
      top: "50%",
      left: "50%"
    }}
  />;
}

export default Preloader;