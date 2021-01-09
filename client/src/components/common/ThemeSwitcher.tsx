import React from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Menu, Dropdown } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import actions from "../../redux/actions/app";

const { Item } = Menu;

const ThemeSwitcher: React.FC = () => {

  const dispatch = useDispatch();

  const handleMenuClick = (event: any) => {
    dispatch(actions.switchTheme(event.key));
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Item key="light">
        <FormattedMessage
          id="themes.light"
          defaultMessage="light"
        />
      </Item>
      <Item key="dark">
        <FormattedMessage
          id="themes.dark"
          defaultMessage="dark"
        />
      </Item>
      <Item key="compact">
        <FormattedMessage
          id="themes.compact"
          defaultMessage="compact"
        />
      </Item>
    </Menu>
  )

  return <Dropdown.Button overlay={menu} icon={<EyeOutlined />}>
    <FormattedMessage
      id="choose-theme"
      defaultMessage="choose theme"
    />
  </Dropdown.Button>
}

export default ThemeSwitcher;