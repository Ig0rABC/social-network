import React from "react";
import { NavLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Menu } from "antd";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/selectors/users";
import CurrentUserAvatar from "../common/CurrentUserAvatar";
import Settings from "../common/SettingsMenu";

const { Item } = Menu;

const NavBar: React.FC = () => {

  const currentUser = useSelector(selectCurrentUser);

  return <Menu theme="dark" mode="horizontal" selectable={false}
    style={{ userSelect: "none" }}
  >
    <Item key="1">
      <NavLink to="/">
        <FormattedMessage
          id="home"
          defaultMessage="home"
        />
      </NavLink>
    </Item>
    <Item key="2">
      <NavLink to={currentUser ? "/users/" + currentUser.id : "/login"}>
        <FormattedMessage
          id="profile"
          defaultMessage="profile"
        />
      </NavLink>
    </Item>
    <Item key="3">
      <NavLink to={currentUser ? "/feed" : "/login"}>
        <FormattedMessage
          id="news-feed"
          defaultMessage="news feed"
        />
      </NavLink>
    </Item>
    <div style={{ float: "right" }}>
      <CurrentUserAvatar />
      <Settings />
    </div>
  </Menu>
}

export default NavBar;