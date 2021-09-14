import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Kitchen from "./Kitchen";
import Customer from "./Customer";

import "./App.css";

function App() {
  return (
    <div className="App">
      <h1> RESTAURANTE TESTE </h1>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/customer" />
          </Route>
          <Route path="/kitchen">
            <Kitchen />
          </Route>
          <Route path="/customer">
            <Customer />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
