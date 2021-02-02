import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toolbar, Button, ButtonGroup, AppBar } from "@material-ui/core";
import { Home, Person, WebAsset } from "@material-ui/icons";
import { selectCurrentUser } from "../../redux/selectors/users";
import { FormattedMessage } from "react-intl";

const Header: React.FC = () => {

  const history = useHistory();
  const currentUser = useSelector(selectCurrentUser);

  const handleHomeClick = () => {
    history.push("/");
  }

  const handleProfileClick = () => {
    if (currentUser) {
      history.push("/users/" + currentUser.id);
    } else {
      history.push("/login");
    }
  }

  const handleFeedClick = () => {
    if (currentUser) {
      history.push("/feed");
    } else {
      history.push("/login");
    }
  }

  return <AppBar position="static" color="transparent">
    <Toolbar>
      <ButtonGroup size="large" variant="text" color="primary">
        <Button onClick={handleHomeClick} startIcon={<Home />} variant="contained">
          <FormattedMessage id="home" />
        </Button>
        <Button onClick={handleProfileClick} startIcon={<Person />}>
          <FormattedMessage id="profile" />
        </Button>
        <Button onClick={handleFeedClick} startIcon={<WebAsset />}>
          <FormattedMessage id="news-feed" />
        </Button>
      </ButtonGroup>
    </Toolbar>
  </AppBar>
}

export default Header;