import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import languages from "./languages";
import { initialize } from "./redux/thunks/app";
import { selectIsInitizialied, selectLanguage } from "./redux/selectors/app";
import Preloader from "./components/common/Preloader";
import MainLayout from "./components/Layouts/MainLayout";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import { withLayout } from "./components/HOCs/withLayout";
import Feed from "./components/Feed/Feed";

const UnauthorizedLayout = lazy(() => import("./components/Layouts/UnauthorizedLayout"));
const Login = lazy(() => import("./components/Login/Login"));
const Register = lazy(() => import("./components/Register/Register"));
const NotFound = lazy(() => import("./components/errors/NotFound"));

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
        <Suspense fallback={<Preloader />}>
          <Switch>
            <Route exact path="/register" component={withLayout(Register, UnauthorizedLayout)} />
            <Route exact path="/login" component={withLayout(Login, UnauthorizedLayout)} />
            <Route exact path="/feed" component={withLayout(Feed, MainLayout)} />
            <Route path="/users/:userId?" component={withLayout(Profile, MainLayout)} />
            <Route exact path="/" component={withLayout(Home, MainLayout)} />
            <Route exact path="/*" component={withLayout(NotFound, MainLayout)} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </IntlProvider>
  )
}

export default App;