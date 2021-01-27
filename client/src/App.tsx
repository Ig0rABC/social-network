import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { FormattedMessage, IntlProvider } from "react-intl";
import "antd/dist/antd.css";
import languages from "./languages";
import { initialize } from "./redux/thunks/app";
import { selectIsInitizialied, selectLanguage } from "./redux/selectors/app";
import Home from "./components/Home/Home";
import Preloader from "./components/Preloader/Preloader";
import Profile from "./components/Profile/Profile";
import Login from "./components/Login/Login";
import MainLayout from "./components/Layouts/MainLayout";
import UnauthorizedLayout from "./components/Layouts/UnauthorizedLayout";
import { Result } from "antd";

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
            <Route exact path="/register" render={() => <UnauthorizedLayout><Register /></UnauthorizedLayout>} />
            <Route exact path="/login" render={() => <UnauthorizedLayout><Login /></UnauthorizedLayout>} />
            <Route path="/users/:userId?" render={() => <MainLayout><Profile /></MainLayout>} />
            <Route exact path="/" render={() => <MainLayout><Home /></MainLayout>} />
            <Route exact path="/*" render={() => <Result title={<FormattedMessage id="errors.404.title"/>} subTitle={<FormattedMessage id="errors.404.description"/>} />} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </IntlProvider>
  )
}

export default App;