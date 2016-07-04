import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './app';
import store from './store';
import DevTools from './containers/DevTools';
// Render the root component normally
const rootEl = document.getElementById('root');
if (module.hot) {
  module.hot.accept();
}
ReactDOM.render(
  <Provider store={store}>
    <App />
    <DevTools />
  </Provider>,
  rootEl
);
