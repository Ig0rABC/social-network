import React from "react";
import { Layout } from "antd";
import NavBar from "./NavBar";
import MyFooter from "./Footer";

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC = ({ children }) => {
  return <Layout style={{ minHeight: "100vh" }}>
    <Header>
      <NavBar />
    </Header>
    <Content style={{ marginTop: "2em", marginLeft: "2em" }}>
      {children}
    </Content>
    <Footer>
      <MyFooter />
    </Footer>
  </Layout>
}

export default MainLayout;