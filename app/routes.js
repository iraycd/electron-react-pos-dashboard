import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import LoginContainer from './containers/LoginContainer';
import DashboardLayout from './components/DashboardLayout';
import Inventory from './containers/InventoryContainer';
import Accounts from './containers/AccountsContainer';
import Analytics from './containers/AnalyticsContainer';
import Reports from './containers/ReportsContainer';
import Cashier from './containers/CashierContainer';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LoginContainer} />
    <Route path="dashboard" component={DashboardLayout}>
      <IndexRoute component={Inventory} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/accounts" component={Accounts} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/reports" component={Reports} />
      <Route path="/cashier(/:timestamp)" component={Cashier} />
    </Route>
  </Route>
);
