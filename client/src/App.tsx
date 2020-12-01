import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import "antd/dist/antd.css";
import languages from "./languages";
import { initialize } from "./redux/reducers/app";
import { selectIsInitizialied, selectLanguage } from "./redux/selectors/app";
import Home from "./components/Home/Home";
import Preloader from "./components/Preloader/Preloader";
import Profile from "./components/Profile/Profile";

const Register = React.lazy(() => import("./components/Register/Register"));

const App: React.FC = () => {

  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitizialied);
  const locale = useSelector(selectLanguage);
  const messages = languages[locale];

  useEffect(() => {
    dispatch(initialize());
  }, [])

  if (!isInitialized) {
    return (
      <IntlProvider key={locale} locale={locale} messages={messages}>
        <Preloader />
      </IntlProvider>
    )
  }

  return (
    <IntlProvider key={locale} locale={locale} messages={messages}>
      <BrowserRouter>
        <React.Suspense fallback={<Preloader />}>
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route path="/users/:userId?" component={Profile} />
            <Route exact path="/" component={Home} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </IntlProvider>
  )
}

export default App;