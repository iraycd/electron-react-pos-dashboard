import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import Notifications from 'material-ui/svg-icons/social/notifications';
import Accounts from 'material-ui/svg-icons/social/people';
import Close from 'material-ui/svg-icons/navigation/close';
import Cart from 'material-ui/svg-icons/action/shopping-cart';
import Folder from 'material-ui/svg-icons/file/folder';
import IconButton from 'material-ui/IconButton';

const styles = {
  bodyStyle: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#EDECEC',
    overflow: 'hidden',
  },
  sideNavContainer: {
    position: 'relative',
    height: '90.5vh',
    padding: 0,
  },
  sideNav: {
    width: '100%',
  },
  mainContent: {
    height: '90vh',
    overflowY: 'auto',
  },
  appbar: {
  },
  hide: {
    display: 'none'
  }
};

@Radium
export default class DashboardLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  constructor() {
    super();

    this.state = {
      isExpanded: true
    };
  }

  _toggleDrawer = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const {
      location,
      params
    } = this.props;
    return (
      <div style={styles.bodyStyle}>
        <AppBar
          title={params.timestamp ? `Change Items - ${new Date(params.timestamp.slice(0, -3) * 1000).toLocaleString()}` : location.pathname.replace('/', '')}
          iconElementLeft={
            params.timestamp ?
              <Link to="/Activities">
                <IconButton>
                  <Close />
                </IconButton>
              </Link> : null
          }
          onLeftIconButtonTouchTap={this._toggleDrawer}
          style={styles.appbar}
        />
        <Paper
          className={params.timestamp ? 'hidden' : this.state.isExpanded ? 'col-xs-1' : 'hidden'}
          style={styles.sideNavContainer}
        >
          <Link to="/Inventory">
            <MenuItem>
              <Folder />
              <span className="hidden-xs hidden-sm hidden-md">Inventory</span>
            </MenuItem>
          </Link>
          <Link to="/Activities">
            <MenuItem>
              <Notifications />
              <span className="hidden-xs hidden-sm hidden-md">Activities</span>
            </MenuItem>
          </Link>
          <Link to="/Analytics">
            <MenuItem>
              <ShowChart />
              <span className="hidden-xs hidden-sm hidden-md">Analytics</span>
            </MenuItem>
          </Link>
          <Link to="/Cashier">
            <MenuItem>
              <Cart />
              <span className="hidden-xs hidden-sm hidden-md">Cashier</span>
            </MenuItem>
          </Link>
          <Link to="/Accounts">
            <MenuItem>
              <Accounts />
              <span className="hidden-xs hidden-sm hidden-md">Accounts</span>
            </MenuItem>
          </Link>
        </Paper>
        <div
          id="children"
          className={this.state.isExpanded ? params.timestamp ? 'col-md-12' : 'col-md-11' : 'col-md-12'}
          style={styles.mainContent}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
