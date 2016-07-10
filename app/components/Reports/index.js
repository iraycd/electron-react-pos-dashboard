import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Cancel from 'material-ui/svg-icons/content/clear';
import DatePicker from 'material-ui/DatePicker';
import styles from './styles';

@Radium
export default class Reports extends Component {
  static propTypes = {
    reports: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    activity: PropTypes.object,
  }

  constructor() {
    super();

    this.state = {
      selectedDate: '',
      selectedCart: '',
      quantity: 0,
    };
  }

  componentWillMount() {
    this.props.actions.fetchAllReports();
  }

  render() {
    const {
      props: {
        reports,
        activity,
      },
      state,
   } = this;

    return (
      <div className="col-md-12">
        <div className="col-md-4">
          <Paper style={styles.activity}>
            <Subheader>
              Latest Activity
              <span style={{ fontWeight: 'bold', fontSize: 25, float: 'right', marginRight: 25 }}>
                ₱{activity && [].concat(...Object.keys(activity)
                                  .filter((timestamp) => !activity[timestamp].changedCartTime)
                                  .map((timestamp) => activity[timestamp].cart))
                                .map((item) => item.quantity * item.sellingPrice)
                                .reduce((p, c) => p + c)}
              </span>
            </Subheader>
            <div style={{ padding: 10 }}>
            {activity && Object.keys(activity).map((timestamp) => (
              <Paper zDepth={2} style={{ padding: 5, marginBottom: 5 }}>
                <div>
                  <Link to={`/cashier/${timestamp}`}>
                    <IconButton touch>
                      <ModeEdit />
                    </IconButton>
                  </Link>
                  &nbsp;
                  <span className="pull-right">
                    {activity[timestamp].changedCartTime ?
                      <del>
                      {new Date(timestamp.slice(0, -3) * 1000).toLocaleTimeString()}
                      </del>
                      : new Date(timestamp.slice(0, -3) * 1000).toLocaleTimeString()
                    }
                  </span>
                </div>
                {activity[timestamp].cart.map((item, i) => (
                  <li key={i}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
                <Divider />
                <span>
                  Cart Total: ₱{activity[timestamp].cart
                                  .map((item) => item.quantity * item.sellingPrice)
                                  .reduce((p, c) => p + c)}
                </span>
              </Paper>
            ))}
            </div>
          </Paper>
        </div>
        <div className="col-md-8">
          <Toolbar>
            <ToolbarGroup firstChild>
              <ToolbarTitle text="Past Activities" />
            </ToolbarGroup>
            <ToolbarGroup>
              <IconButton
                onTouchTap={() => this.setState({ selectedDate: '' })}
                touch
              >
                <Cancel />
              </IconButton>
              <DatePicker
                locale="en-US"
                hintText="Select Date"
                mode="landscape"
                container="inline"
                formatDate={(date) => date.toDateString()}
                onChange={
                  (e, date) => this.setState({
                    selectedDate: date.toLocaleDateString().replace(/\//g, '-')
                  })
                }
              />
            </ToolbarGroup>
          </Toolbar>
          <div style={styles.pastReports}>
          {Object.keys(reports)
            .map((rep) => (rep !== new Date().toLocaleDateString().replace(/\//g, '-') ? rep : null))
            .filter((rep) => (state.selectedDate ? rep === state.selectedDate : rep))
            .map((dayMonth) => (
              <Paper style={styles.listPaper}>
                <List>
                  <Subheader>
                    ({dayMonth}) Total Profit: ₱ {Object.keys(reports[dayMonth])
                                                    .filter((timestamp) => !reports[dayMonth][timestamp].changedCartTime)
                                                    .map((timestamp) => reports[dayMonth][timestamp].cart
                                                      .map((item) => item.sellingPrice * item.quantity)
                                                      .reduce((p, c) => p + c))
                                                    .reduce((p, c) => p + c)}
                  </Subheader>
                  <Divider />
                {Object.keys(reports[dayMonth]).map((timestamp) => (
                  <ListItem
                    nestedItems={
                      reports[dayMonth][timestamp].cart.map((item) => (
                        <ListItem
                          nestedItems={[
                            <ListItem>
                              Price: {`₱${item.sellingPrice}`}
                            </ListItem>,
                            <ListItem>
                              Subtotal: {`₱${item.quantity * item.sellingPrice}`}
                            </ListItem>,
                            <ListItem>
                              Remaining Stock/s: {item.stock}
                            </ListItem>
                          ]}
                          primaryTogglesNestedList
                        >
                          {item.name} x{item.quantity}
                        </ListItem>
                      ))
                    }
                    primaryTogglesNestedList
                  >
                  <Link to={`/cashier/${timestamp}`}>
                    <IconButton touch>
                      <ModeEdit />
                    </IconButton>
                  </Link>
                    <span style={{ textDecoration: reports[dayMonth][timestamp].changedCartTime ? 'line-through' : 'none' }}>
                      ({new Date(timestamp.slice(0, -3) * 1000).toLocaleTimeString()})
                      Cart Total: ₱ {reports[dayMonth][timestamp].cart
                        .map((item) => item.quantity * item.sellingPrice)
                        .reduce((p, c) => p + c)}
                    </span>
                  </ListItem>
                ))}
                </List>
              </Paper>
          ))}
          </div>
        </div>
        <Divider />
      </div>
    );
  }
}
