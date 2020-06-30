import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './App.css';
import 'rsuite/dist/styles/rsuite-default.min.css'

import Menu from "./Menu";
import Login from "./Login";
import Signup from "./Signup";
import TicketCreate from "./TicketCreate";
import TicketUpdate from "./TicketUpdate";
import TicketList from "./TicketList";

//global variable
window.$name = 'king';

function App() {
  return (
    // <div className="App">
    //   <Login/>
    // </div>

    <BrowserRouter>
    <div className="App">
      <Menu/>
      <Switch>
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
          <Route path='/create' component={TicketCreate} />
          <Route path='/detail' component={TicketUpdate} />
          <Route path='/list' component={TicketList} />
      </Switch>
      <div className="loading-frame" id="loading">
        <div className="loading-container">
          <img src={process.env.PUBLIC_URL + '/images/loading.gif'} />
        </div>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
