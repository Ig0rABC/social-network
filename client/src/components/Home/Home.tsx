import React from "react";
import LanguageSwitcher from "../common/LanguageSwitcher";
import LogoutButton from "../common/LogoutButton";
import ThemeSwitcher from "../common/ThemeSwitcher";
import Login from "../Login/Login";
import PostForm from "../Posts/PostForm";
import Posts from "../Posts/Posts";

const Home: React.FC = () => {
  return <div>
    <LanguageSwitcher />
    <ThemeSwitcher />
    <Login />
    <LogoutButton />
    <PostForm />
    <Posts />
  </div>
}

export default Home;