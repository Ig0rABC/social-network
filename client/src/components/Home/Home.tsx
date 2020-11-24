import React from "react";
import LanguageSwitcher from "../common/LanguageSwitcher";
import LogoutButton from "../common/LogoutButton";
import ThemeSwitcher from "../common/ThemeSwitcher";
import Login from "../Login/Login";
import PostForm from "../Posts/PostForm";

const Home: React.FC = () => {
  return <div>
    <Login />
    <LogoutButton />
    <LanguageSwitcher />
    <ThemeSwitcher />
    <PostForm />
  </div>
}

export default Home;