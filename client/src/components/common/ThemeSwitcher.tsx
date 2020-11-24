import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../../redux/selectors/app";
import { Theme } from "../../types/app";
import { actions } from "../../redux/reducers/app";
import { FormattedMessage } from "react-intl";
import { EyeOutlined } from "@ant-design/icons";
import { Menu, Dropdown } from "antd";

const ThemeSwitcher: React.FC = () => {

  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  
  const handleMenuClick = (event: any): void => {
    dispatch(actions.switchTheme(event.key as Theme));
  }

  const menu = (
    <Menu onClick={handleMenuClick} theme={theme}>
      <Menu.Item key="light">
        <FormattedMessage
          id="themes.light"
          defaultMessage="light"
        />
      </Menu.Item>
      <Menu.Item key="dark">
        <FormattedMessage
          id="themes.dark"
          defaultMessage="dark"
        />
      </Menu.Item>
    </Menu>
  )

  return <Dropdown.Button overlay={menu} icon={<EyeOutlined />}>
    <FormattedMessage
      id="choose-theme"
      defaultMessage="choose theme"
      description="choose theme dropdown"
    />
  </Dropdown.Button>
}

export default ThemeSwitcher;