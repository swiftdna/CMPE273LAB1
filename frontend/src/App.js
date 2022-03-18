import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/Main';
import { Provider } from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import configureStore from './configureStore'

const store = configureStore();

//App Component
class App extends Component {
  render() {
    return (
      //Use Browser Router to route to different pages
      <Provider store={store}>
        <BrowserRouter>
          {/* App Component Has a Child Component called Main*/}
          <Main/>
        </BrowserRouter>
      </Provider>
    );
  }
}

//Export the App component so that it can be used in index.js
export default App;
