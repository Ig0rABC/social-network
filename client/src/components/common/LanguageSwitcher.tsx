import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../../redux/selectors/app";
import { Language } from "../../types/app";
import actions from "../../redux/actions/app";
import { Menu, Dropdown } from "antd";
import { TranslationOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";

const LanguageSwitcher: React.FC = () => {

  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const handleMenuClick = (event: any): void => {
    dispatch(actions.switchLanguage(event.key as Language));
  }

  const menu = (
    <Menu onClick={handleMenuClick} theme={theme}>
      <Menu.Item key="en">
        English
      </Menu.Item>
      <Menu.Item key="ru">
        Русский
      </Menu.Item>
    </Menu>
  )

  return <Dropdown.Button overlay={menu} icon={<TranslationOutlined />}>
    <FormattedMessage
      id="choose-language"
      defaultMessage="choose language"
      description="choose language dropdown"
    />
  </Dropdown.Button>
}

export default LanguageSwitcher;