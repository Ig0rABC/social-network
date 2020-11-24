import React from "react";
import "antd/dist/antd.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLanguage } from "./redux/selectors/app";
import { IntlProvider } from "react-intl";
import Preloader from "./components/common/Preloader";
import languages from "./languages";
import Home from "./components/Home/Home";

const Register = React.lazy(() => import("./components/Register/Register"));

const App: React.FC = () => {

  const locale = useSelector(selectLanguage);
  const messages = languages[locale];

  return <IntlProvider key={locale} locale={locale} messages={messages}>
    <BrowserRouter>
      <React.Suspense fallback={<Preloader />}>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/" component={Home} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  </IntlProvider>
}

export default App;