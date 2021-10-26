import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";
import Header from "./Header/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Profile from "./MyAccount/Profile";
import Container from "@mui/material/Container";
import config from "../local.settings.json";

ReactDOM.render(
  <Auth0Provider
    domain={config.auth0.domain}
    clientId={config.auth0.clientId}
    redirectUri={window.location.origin}
    audience={config.auth0.audience}
    cacheLocation="localstorage"
  >
    <Container maxWidth="xl" style={{ padding: 0 }}>
      <Router>
        <Header />
        <Switch>
          <Route path="/profile" component={Profile} />
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </Container>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
