import React from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { setLanguage, setTheme } from "../../redux/actions/app";

const Settings: React.FC = () => {

  const dispatch = useDispatch();

  const handleThemeClick = ({ key }: any) => {
    dispatch(setTheme(key));
  }

  const handleLanguageClick = ({ key }: any) => {
    dispatch(setLanguage(key));
  }

  return <FormattedMessage id="settings" />
}

export default Settings;