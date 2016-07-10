import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as routing } from 'react-router-redux';

import invUI from './inventoryUI';
import items from './inventoryItems';
import accUI from './accountUI';
import users from './accountUsers';
import login from './login';
import reports from './reports';
import cashier from './cashier';
import cart from './cart';

const inventory = combineReducers({
  ui: invUI,
  items,
});

const account = combineReducers({
  ui: accUI,
  users,
});

const rootReducer = combineReducers({
  inventory,
  account,
  reports,
  cashier,
  cart,
  login,
  routing,
  form: form.normalize({
    new_inventory_item: {
      id: val => Number(val),
      cost: val => Number(val),
      sellingPrice: val => Number(val),
      stock: val => Number(val),
    },
    update_inventory_item: {
      id: val => Number(val),
      cost: val => Number(val),
      sellingPrice: val => Number(val),
      stock: val => Number(val),
    },
  }),
});

export default rootReducer;
