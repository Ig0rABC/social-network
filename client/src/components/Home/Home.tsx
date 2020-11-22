import React from "react";
import LanguageSwitcher from "../common/LanguageSwitcher";
import ThemeSwitcher from "../common/ThemeSwitcher";
import Login from "../Login/Login";

const Home: React.FC = () => {
  return <div>
    <Login />
    <LanguageSwitcher />
    <ThemeSwitcher />
  </div>
}

export default Home;