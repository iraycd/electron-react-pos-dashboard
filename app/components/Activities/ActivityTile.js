import React from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Return from 'material-ui/svg-icons/content/undo';

import styles from './styles';

const ActivityTile = ({
  timestamp,
  isActivityNowChanged,
  actions,
  transactionTime,
  activityNow,
  cartTotal,
}) => (
  <Paper zDepth={2} style={styles.activityNow}>
    <div>
      <Link to={`/cashier/${timestamp}`}>
        <IconButton className={isActivityNowChanged ? 'hide' : ''} touch>
          <ModeEdit />
        </IconButton>
      </Link>
      <IconButton
        onTouchTap={() => toggleActivity(timestamp, 'refund')}
        className={activityNow.refundedCartTime || !isActivityNowChanged ? '' : 'hide'}
        touch
      >
        <Return />
      </IconButton>
      &nbsp;
      <span
        className="pull-right"
        style={{ textDecoration: isActivityNowChanged ? 'line-through' : 'none' }}
      >
        {transactionTime}
      </span>
    </div>
    {activityNow.cart.map((item, i) => (
      <li
        key={i}
        style={{ textDecoration: isActivityNowChanged ? 'line-through' : 'none' }}
      >
        {item.name} x {item.quantity} = ₱{item.sellingPrice * item.quantity}
      </li>
    ))}
    <Divider />
    <span style={{ textDecoration: isActivityNowChanged ? 'line-through' : 'none' }}>
      Cart Total: ₱{cartTotal()}
    </span>
  </Paper>
);

ActivityTile.propTypes = {

};

export default ActivityTile;
