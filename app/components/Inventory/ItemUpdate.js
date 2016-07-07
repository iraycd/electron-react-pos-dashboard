import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TextField from 'material-ui/TextField';
import Done from 'material-ui/svg-icons/action/done';
import Cancel from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';

@reduxForm({
  form: 'update_inventory_item',
  fields: [
    'id',
    'name',
    'category',
    'cost',
    'sellingPrice',
    'stock',
    'brand',
    'supplier',
    'description',
    'image'
  ]
})
class ItemUpdate extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    editRowItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    loadInitialValues: PropTypes.func.isRequired
  }

  _onFocus = () => {
    const { item, loadInitialValues } = this.props;

    loadInitialValues(item);
  }

  _updateItem = () => {
    const changedFields = {};
    const {
      item,
      values,
      editRowItem,
      updateItem,
    } = this.props;

    Object.keys(item).forEach((key) => {
      if (values.hasOwnProperty(key) && values[key] !== item[key]) {
        changedFields[key] = values[key];
      }
    });

    if (Object.keys(changedFields).length) updateItem(item.id, changedFields);
    editRowItem(-1);
  }

  render() {
    const {
      fields,
      item: { id },
      selected,
      editRowItem,
    } = this.props;

    return (
      <TableRow key={id} selected={selected}>
        <TableRowColumn>
          <TextField // FIXME: number fields accepts 0 value
            {...fields.id}
            type="number"
            min={1}
            step="any"
            onFocus={this._onFocus}
            autoFocus
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField {...fields.name} />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            {...fields.cost}
            type="number"
            min={1}
            step="any"
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            {...fields.sellingPrice}
            type="number"
            min={1}
            step="any"
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            type="number"
            step="any"
            {...fields.stock}
          />
        </TableRowColumn>
        {/* <TableRowColumn>
          <TextField {...fields.category} />
        </TableRowColumn>
        <TableRowColumn>
          <TextField {...fields.brand} />
        </TableRowColumn>
        <TableRowColumn>
          <TextField {...fields.supplier} />
        </TableRowColumn>
        <TableRowColumn>
          <TextField {...fields.description} />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            {...fields.image}
            type="file"
            value={null}
            floatingLabelText="image"
            fullWidth
          />
        </TableRowColumn>*/}
        <TableRowColumn />
        <TableRowColumn style={{ textAlign: 'right' }}>
          <IconButton onTouchTap={() => editRowItem(-1)} touch>
            <Cancel />
          </IconButton>
          <IconButton onTouchTap={this._updateItem} touch>
            <Done />
          </IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default ItemUpdate;
