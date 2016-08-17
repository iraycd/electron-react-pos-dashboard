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
import Return from 'material-ui/svg-icons/content/undo';
import DatePicker from 'material-ui/DatePicker';
import styles from './styles';

@Radium
export default class Activities extends Component {
  static propTypes = {
    activities: PropTypes.object.isRequired,
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
    this.props.actions.fetchAll();
  }

  render() {
    const {
      props: {
        activities,
        activity,
        actions,
        wew
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
                                .reduce((p, c) => p + c, 0)}
              </span>
            </Subheader>
            <div style={{ padding: 10 }}>
            {activity && Object.keys(activity).map((timestamp) => (
              <Paper zDepth={2} style={{ padding: 5, marginBottom: 5 }}>
                <div>
                  <Link to={`/cashier/${timestamp}`}>
                    <IconButton className={activity[timestamp].changedCartTime ? 'hide' : ''} touch>
                      <ModeEdit />
                    </IconButton>
                  </Link>
                  <IconButton
                    onTouchTap={() => actions.toggleActivity(timestamp)}
                    touch
                  >
                    <Return />
                  </IconButton>
                  &nbsp;
                  <span
                    className="pull-right"
                    style={{ textDecoration: activity[timestamp].changedCartTime ? 'line-through' : 'none' }}
                  >
                    {new Date(timestamp.slice(0, -3) * 1000).toLocaleTimeString()}
                  </span>
                </div>
                {activity[timestamp].cart.map((item, i) => (
                  <li
                    key={i}
                    style={{ textDecoration: activity[timestamp].changedCartTime ? 'line-through' : 'none' }}
                  >
                    {item.name} x {item.quantity} = ₱{item.sellingPrice * item.quantity}
                  </li>
                ))}
                <Divider />
                <span style={{ textDecoration: activity[timestamp].changedCartTime ? 'line-through' : 'none' }}>
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
          <div style={styles.past}>
          {activities && Object.keys(activities)
            .map((activity) => (activity !== new Date().toLocaleDateString().replace(/\//g, '-') ? activity : null))
            .filter((activity) => (state.selectedDate ? activity === state.selectedDate : activity))
            .map((dayMonth) => (
              <Paper style={styles.listPaper}>
                <List>
                  <Subheader>
                    ({dayMonth}) Total Profit: ₱ {Object.keys(activities[dayMonth])
                                                    .filter((timestamp) => !activities[dayMonth][timestamp].changedCartTime)
                                                    .map((timestamp) => activities[dayMonth][timestamp].cart
                                                      .map((item) => item.sellingPrice * item.quantity)
                                                      .reduce((p, c) => p + c))
                                                    .reduce((p, c) => p + c, 0)}
                  </Subheader>
                  <Divider />
                {Object.keys(activities[dayMonth]).map((timestamp) => (
                  <ListItem
                    nestedItems={
                      activities[dayMonth][timestamp].cart.map((item) => (
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
                      <IconButton
                        className={activities[dayMonth][timestamp].changedCartTime ? 'hide' : ''}
                        touch
                      >
                        <ModeEdit />
                      </IconButton>
                    </Link>
                    <IconButton
                      onTouchTap={() => actions.removeActivity(timestamp)}
                      className={activity && [timestamp].changedCartTime ? 'hide' : ''}
                      touch
                    >
                      <Return />
                    </IconButton>
                    <span style={{ textDecoration: activities[dayMonth][timestamp].changedCartTime ? 'line-through' : 'none' }}>
                      ({new Date(timestamp.slice(0, -3) * 1000).toLocaleTimeString()})
                      Cart Total: ₱ {activities[dayMonth][timestamp].cart
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
