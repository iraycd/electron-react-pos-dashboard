import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './redux/store/configureStore.development';
import './app.global.css';
// localStorage.removeItem('inventoryItems');
// localStorage.removeItem('activities');
Storage.prototype.setObj = function setObj(key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function getObj(key) {
  return JSON.parse(this.getItem(key));
};

console.log(localStorage.getObj('inventoryItems'));
console.log(localStorage.getObj('activities'));

const store = configureStore({
  inventory: {
    items: localStorage.getObj('inventoryItems') || [],
  },
  activities: localStorage.getObj('activities') || {},
});
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
