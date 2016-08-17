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

const cachedItems = localStorage.getObj('inventoryItems');
const cachedActivities = localStorage.getObj('activities');
const cachedItemsFiltered = cachedItems ? cachedItems.filter((item) => item !== null) : [];
const cachedActivitiesFiltered = cachedActivities ? Object.keys(cachedActivities).filter((activity) => cachedActivities[activity] !== null) : {};
console.log(cachedActivities);
console.log(cachedItems);
const store = configureStore({
  inventory: {
    items: cachedItemsFiltered
  },
  activities: cachedActivitiesFiltered,
});
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
