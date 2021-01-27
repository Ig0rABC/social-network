import React from "react";

export const withLayout = (Component: React.FC, Layout: React.FC) => () => {
  return <Layout>
    <Component />
  </Layout>
}