import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./login/login";
import Signup from "./signup/signup";
import Dashboard from "./dashboard/dashboard";

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyBAljP4woT1S6Lq9MeF7d3t0CbZrpfBXLE",
  authDomain: "chat-app-facc6.firebaseapp.com",
  databaseURL: "https://chat-app-facc6.firebaseio.com",
  projectId: "chat-app-facc6",
  storageBucket: "chat-app-facc6.appspot.com",
  messagingSenderId: "682730915379",
  appId: "1:682730915379:web:7db70563e93594edb84546",
  measurementId: "G-FR6YRSNMSR",
});

const routing = (
  <Router>
    <div id="routingContainer">
      <Route path="/login" component={Login}></Route>
      <Route path="/signup" component={Signup}></Route>
      <Route path="/dashboard" component={Dashboard}></Route>
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
