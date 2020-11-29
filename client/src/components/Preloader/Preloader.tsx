import React from "react";
import { useIntl } from "react-intl";
import { Spin } from "antd";
import styles from "./Preloader.module.css";

const Preloader: React.FC = () => {

  const intl = useIntl();

  return (
    <div className={styles.appPreloader}>
      <Spin size="large" tip={intl.formatMessage({
        id: "loading",
        defaultMessage: "loading"
      }) + "..."} />
    </div>
  )
}

export default Preloader;