import React from "react";
import NavBar from "./Header";
import Footer from "./Footer";

const MainLayout: React.FC = ({ children }) => {
  return <div>
    <NavBar />
    {children}
    <Footer />
  </div>
}

export default MainLayout;