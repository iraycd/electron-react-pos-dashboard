import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './../modules';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: 'AIzaSyAfQL_veurKkeW3Tbfzn7WCWXJtbycBq68',
  authDomain: 'vivid-torch-4276.firebaseapp.com',
  databaseURL: 'https://vivid-torch-4276.firebaseio.com',
  storageBucket: 'vivid-torch-4276.appspot.com',
});

const firebaseAPI = {
  ref: firebase.database().ref(),
  storage: firebase.storage().ref(),
  auth: firebase.auth,
  timestamp: firebase.database.ServerValue.TIMESTAMP,
};

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

const router = routerMiddleware(hashHistory);

function syncLocalStorage() {
  return ({ getState }) => next => action => {
    const { inventory, reports } = getState();

    switch (action.type) {
      case 'ALL_ITEMS_FETCHED':
      case 'NEW_ITEM':
      case 'UPDATE_ITEM':
      case 'REMOVE_ITEMS':
      case 'ITEM_STOCK_UPDATED':
        localStorage.setObj('inventoryItems', inventory.items);
        console.log('local inventory items synced');
        break;
      case 'REPORTS_RETRIEVED':
      case 'NEW_REPORT':
      case 'UPDATE_REPORT':
        localStorage.setObj('reports', reports);
        console.log('local reports synced');
        break;
      default:
    }

    return next(action);
  };
}

const enhancer = compose(
  applyMiddleware(thunk.withExtraArgument(firebaseAPI), syncLocalStorage(), router, logger),
  window.devToolsExtension ? window.devToolsExtension() : noop => noop
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('./../modules', () =>
      store.replaceReducer(require('./../modules'))
    );
  }

  return store;
}
