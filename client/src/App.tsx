import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsInitizialied, selectLanguage } from "./redux/selectors/app";
import { IntlProvider } from "react-intl";
import { Spin } from "antd";
import languages from "./languages";
import Home from "./components/Home/Home";
import { initialize } from "./redux/reducers/app";

const Register = React.lazy(() => import("./components/Register/Register"));

const App: React.FC = () => {

  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitizialied);

  useEffect(() => {
    dispatch(initialize())
  }, [])

  const locale = useSelector(selectLanguage);
  const messages = languages[locale];

  if (!isInitialized) {
    return <Spin size="large" />
  }

  return <IntlProvider key={locale} locale={locale} messages={messages}>
    <BrowserRouter>
      <React.Suspense fallback={<Spin size="large" />}>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route path="/users" render={() => <div>User Profile</div>} />
          <Route exact path="/" component={Home} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  </IntlProvider>
}

export default App;