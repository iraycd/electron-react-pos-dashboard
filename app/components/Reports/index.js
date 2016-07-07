import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
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
      selectedDate: ''
    };
  }

  componentWillMount() {
    this.props.actions.fetchAllReports();
  }

  render() {
    const {
      reports,
      activity,
   } = this.props;

    return (
      <div className="col-md-12">
        <div className="col-md-4">
          <Paper style={styles.activity}>
            <Subheader>
              Latest Activity
              <span style={{ fontWeight: 'bold', fontSize: 25, float: 'right', marginRight: 25 }}>
                ₱{activity && [].concat(...Object.keys(activity)
                    .map(timestamp => activity[timestamp]))
                    .map(item => item.quantity * item.price)
                    .reduce((p, c) => p + c)}
              </span>
            </Subheader>
            <div style={{ padding: 10 }}>
            {activity && Object.keys(activity).map((timestamp) => (
              <Paper zDepth={2} style={{ padding: 5, marginBottom: 5 }}>
                <div>
                  &nbsp;
                  <span className="pull-right">
                    {new Date(timestamp.slice(0, -3) * 1000).toLocaleTimeString()}
                  </span>
                </div>
                {activity[timestamp].map((item) => (
                  <li>
                    {item.name} x {item.quantity}
                  </li>
                ))}
                <Divider />
                <span>
                  Cart Total: ₱
                  {activity[timestamp].map((item) => item.quantity * item.price)
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
                onTouchTap={
                  () => {
                    this.setState({ selectedDate: '' });
                  }
                }
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
            .filter((rep) => (this.state.selectedDate ? rep === this.state.selectedDate : rep))
            .map((dayMonth) => (
              <Paper style={styles.listPaper}>
                <List>
                  <Subheader>
                    ({dayMonth}) Total Profit: ₱ {Object.keys(reports[dayMonth])
                                                    .map((timestamp) => reports[dayMonth][timestamp]
                                                    .map((item) => item.price * item.quantity)
                                                    .reduce((p, c) => p + c))
                                                    .reduce((p, c) => p + c)}
                  </Subheader>
                  <Divider />
                {Object.keys(reports[dayMonth]).reverse().map((timestamp) => (
                  <ListItem
                    nestedItems={
                      reports[dayMonth][timestamp].map((item) => (
                        <ListItem
                          nestedItems={[
                            <ListItem>
                              Price: {`₱${item.price}`}
                            </ListItem>,
                            <ListItem>
                              Subtotal: {`₱${item.quantity * item.price}`}
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
                    ({new Date(timestamp.slice(0, -3) * 1000).toLocaleTimeString()})
                    Cart Total: ₱ {reports[dayMonth][timestamp]
                                    .map((item) => item.quantity * item.price)
                                    .reduce((p, c) => p + c)}
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
