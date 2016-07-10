import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import Report from 'material-ui/svg-icons/content/report';
import Accounts from 'material-ui/svg-icons/social/people';
import Folder from 'material-ui/svg-icons/file/folder';

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
      isExpanded: false
    };
  }

  _toggleDrawer = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    return (
      <div style={styles.bodyStyle}>
        <AppBar
          title="Admin Dashboard"
          onLeftIconButtonTouchTap={this._toggleDrawer}
          style={styles.appbar}
        />
        <Paper
          className={this.state.isExpanded ? 'col-xs-1' : 'hidden'}
          style={styles.sideNavContainer}
        >
          <Link to="/inventory">
            <MenuItem>
              <span className="hidden-xs hidden-sm hidden-md">inventory</span>
              <Folder />
            </MenuItem>
          </Link>
          <Link to="/accounts">
            <MenuItem>
              <span className="hidden-xs hidden-sm hidden-md">accounts</span>
              <Accounts />
            </MenuItem>
          </Link>
          <Link to="/analytics">
            <MenuItem>
              <span className="hidden-xs hidden-sm hidden-md">analytics</span>
              <ShowChart />
            </MenuItem>
          </Link>
          <Link to="/reports">
            <MenuItem>
              <span className="hidden-xs hidden-sm hidden-md">reports</span>
              <Report />
            </MenuItem>
          </Link>
          <Link to="/cashier">
            <MenuItem>
              <span className="hidden-xs hidden-sm hidden-md">cashier</span>
              <Report />
            </MenuItem>
          </Link>
        </Paper>
        <div
          id="children"
          className={this.state.isExpanded ? 'col-md-11' : 'col-md-12'}
          style={styles.mainContent}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
