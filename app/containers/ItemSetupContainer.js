import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import ItemSetup from './../components/Inventory/ItemSetup';
import { addNewItem } from './../redux/modules/inventoryItems';
import { validateField } from './../redux/modules/inventoryUI';
import { getProp, getFieldsError } from './../selectors/inventorySelectors.js';

function mapStateToProps(state) {
  return {
    fieldError: getFieldsError(state),
    categories: getProp(state, 'category'),
    brands: getProp(state, 'brand'),
    suppliers: getProp(state, 'supplier'),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ addNewItem, validateField, reset }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemSetup);
