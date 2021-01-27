import React from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Menu } from "antd";
import { SettingOutlined, EyeOutlined, TranslationOutlined } from "@ant-design/icons";
import { setLanguage, setTheme } from "../../redux/actions/app";

const { SubMenu, Item } = Menu;

const Settings: React.FC = () => {

  const dispatch = useDispatch();

  const handleThemeClick = ({ key }: any) => {
    dispatch(setTheme(key));
  }

  const handleLanguageClick = ({ key }: any) => {
    dispatch(setLanguage(key));
  }

  return <Menu theme="dark" selectable={false} style={{float: "right"}} mode="horizontal">
  <SubMenu icon={<SettingOutlined />} title={<FormattedMessage id="settings" />}>
    <SubMenu key="theme" icon={<EyeOutlined />} title={<FormattedMessage id="choose-theme" />}>
      <Item onClick={handleThemeClick} key="light">
        <FormattedMessage
          id="themes.light"
          defaultMessage="light"
        />
      </Item>
      <Item onClick={handleThemeClick} key="dark">
        <FormattedMessage
          id="themes.dark"
          defaultMessage="dark"
        />
      </Item>
      <Item onClick={handleThemeClick} key="compact">
        <FormattedMessage
          id="themes.compact"
          defaultMessage="compact"
        />
      </Item>
    </SubMenu>
    <SubMenu key="language" icon={<TranslationOutlined />} title={<FormattedMessage id="choose-language" />}>
      <Item onClick={handleLanguageClick} key="en">
        English
      </Item>
      <Item onClick={handleLanguageClick} key="ru">
        Русский
      </Item>
    </SubMenu>
  </SubMenu>
  </Menu>
}

export default Settings;