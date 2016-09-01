import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './../modules';
import firebase from 'firebase/app';
import 'firebase/database';
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

const router = routerMiddleware(hashHistory);

function syncLocalStorage() {
  return ({ getState }) => next => action => {
    const { inventory, activities } = getState();

    switch (action.type) {
      case 'ALL_ITEMS_FETCHED':
      case 'NEW_ITEM':
      case 'UPDATE_ITEM':
      case 'REMOVE_ITEMS':
      case 'ITEM_STOCK_UPDATED':
        localStorage.setObj('inventoryItems', inventory.items);
        break;
      case 'ACTIVITIES_RETRIEVED':
      case 'NEW_ACTIVITY':
      case 'UPDATE_ACTIVIES':
        localStorage.setObj('activities', activities);
        break;
      default:
    }

    return next(action);
  };
}

const enhancer = applyMiddleware(thunk.withExtraArgument(firebaseAPI), syncLocalStorage(), router);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
