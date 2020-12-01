import React from "react";
import CurrentUserAvatar from "../common/CurrentUserAvatar";
import LanguageSwitcher from "../common/LanguageSwitcher";
import LogoutButton from "../common/LogoutButton";
import ThemeSwitcher from "../common/ThemeSwitcher";
import Login from "../Login/Login";
import Posts from "../Posts/Posts";

const Home: React.FC = () => {
  return <div>
    <CurrentUserAvatar />
    <LanguageSwitcher />
    <ThemeSwitcher />
    <Login />
    <LogoutButton />
    <Posts isOwnPosts={false} />
  </div>
}

export default Home;