import React from "react";
import { Route, IndexRoute } from "react-router";
import App from "./components/App";
import StartupPage from "./components/startup/StartupContainer";

export default (
    <Route path="./index.html" component={ App }>
        <IndexRoute component={ StartupPage } />
    </Route>
);