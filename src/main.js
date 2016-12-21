"use strict";
import { createMemoryHistory } from "react-router";
import { render } from "react-dom";
import App from "./components/App";
import AppStore from "./store/appStore";
import "babel-polyfill";
import React from "react";

const initialState = window.__INITIAL_STATE__;
const config = window.__CONFIG__;

const history = createMemoryHistory("/");
const store = new AppStore();

render(
    <App
        config={ config }
        history={ history }
        initialState={ initialState }
        store={ store }
    />, document.getElementById("app")
);