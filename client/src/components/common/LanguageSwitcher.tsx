import React from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Menu, Dropdown } from "antd";
import { TranslationOutlined } from "@ant-design/icons";
import actions from "../../redux/actions/app";

const { Item } = Menu;

const LanguageSwitcher: React.FC = () => {

  const dispatch = useDispatch();

  const handleMenuClick = (event: any) => {
    dispatch(actions.switchLanguage(event.key));
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Item key="en">
        English
      </Item>
      <Item key="ru">
        Русский
      </Item>
    </Menu>
  )

  return <Dropdown.Button overlay={menu} icon={<TranslationOutlined />}>
    <FormattedMessage
      id="choose-language"
      defaultMessage="choose language"
    />
  </Dropdown.Button>
}

export default LanguageSwitcher;