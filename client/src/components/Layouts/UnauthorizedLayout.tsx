import React from "react";
import { Grid } from "@material-ui/core";
import Footer from "./Footer";

const UnauthorizedLayout: React.FC = ({ children }) => {
  return <Grid container direction="column" justify="space-between" alignItems="center" style={{ height: "95vh" }}>
    <Grid item>
      {children}
    </Grid>
    <Grid item>
      <Footer />
    </Grid>
  </Grid>
}

export default UnauthorizedLayout;