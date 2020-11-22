import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLanguage } from "./redux/selectors/app";
import { IntlProvider } from "react-intl";
import Preloader from "./components/common/Preloader";
import languages from "./languages";

const Register = React.lazy(() => import("./components/Register/Register"));

const App: React.FC = () => {

  const locale = useSelector(selectLanguage);
  const messages = languages[locale];

  return <IntlProvider key={locale} locale={locale} messages={messages}>
    <div className="App">
      <BrowserRouter>
        <React.Suspense fallback={<Preloader />}>
          <Switch>
            <Route exact path="/register" component={Register} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </div>
  </IntlProvider>
}

export default App;