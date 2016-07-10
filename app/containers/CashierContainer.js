import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getGridTiles, getItems } from './../selectors/cashierSelectors';
import Cashier from './../components/Cashier';
import * as cashierActions from './../redux/modules/cashier';
import * as cartActions from './../redux/modules/cart';
import { fetchInventoryItems } from './../redux/modules/inventoryItems';


function mapStateToProps(state) {
  const {
    cashier,
    cart,
    reports,
  } = state;

  return {
    tiles: getGridTiles(state),
    items: getItems(state),
    cart,
    cashier,
    reports,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...cashierActions,
      ...cartActions,
      fetchInventoryItems,
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cashier);
