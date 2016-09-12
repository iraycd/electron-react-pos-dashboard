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

const enhancer = applyMiddleware(thunk.withExtraArgument(firebaseAPI), router);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
