import React from "react";
import { Layout } from "antd";
import MyFooter from "./Footer";

const { Content, Footer } = Layout;

const UnauthorizedLayout: React.FC = ({ children }) => {
  return <Layout style={{ minHeight: "100vh" }}>
    <Content style={{ marginTop: "2em", marginLeft: "2em" }}>
      {children}
    </Content>
    <Footer>
      <MyFooter />
    </Footer>
  </Layout>
}

export default UnauthorizedLayout;