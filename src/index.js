import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthorBox from './Autor';
import Home from './Home';
import './index.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

ReactDOM.render(
  (<Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/author" component={AuthorBox} />
      <Route path="/book" />
    </Route>
  </Router>),
  document.getElementById('root')
);
