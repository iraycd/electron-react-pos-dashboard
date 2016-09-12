import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TextField from 'material-ui/TextField';
import Done from 'material-ui/svg-icons/action/done';
import Cancel from 'material-ui/svg-icons/content/clear';
import AutoComplete from 'material-ui/AutoComplete';
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
    const { item, values, editRowItem, updateItem, } = this.props;

    Object.keys(item).forEach((key) => {
      if (values.hasOwnProperty(key) && values[key] !== item[key]) {
        changedFields[key] = values[key];
      }
    });

    if (Object.keys(changedFields).length) updateItem(item.id, changedFields);
    editRowItem(-1);
  }

  render() {
    const { fields, item, selected, editRowItem, itemsName, isItemDrawerEdit, cancelEditing } = this.props;

    if (isItemDrawerEdit) {
      return (
        <div>
          <TextField // FIXME: number fields accepts 0 value
            {...fields.id}
            floatingLabelText="ID"
            type="number"
            min={1}
            step={1}
            onFocus={this._onFocus}
            autoFocus
          />
          <br />
          <AutoComplete
            {...fields.name}
            floatingLabelText="Item Name"
            searchText={fields.name.value}
            dataSource={itemsName}
            filter={AutoComplete.fuzzyFilter}
            openOnFocus
          />
          <br />
          <TextField
            {...fields.cost}
            type="number"
            floatingLabelText="Product Cost"
            min={1}
            step="any"
          />
          <br />
          <TextField
            {...fields.sellingPrice}
            floatingLabelText="Selling Price"
            type="number"
            min={1}
            step="any"
          />
          <br />
          <TextField
            {...fields.stock}
            type="number"
            step="any"
            floatingLabelText="Stock"
          />
          <br />
          <TextField
            {...fields.category}
            floatingLabelText="Category"
          />
          <br />
          <TextField
            {...fields.brand}
            floatingLabelText="Brand"
          />
          <br />
          <TextField
            {...fields.supplier}
            floatingLabelText="Supplier"
          />
          <br />
          <TextField
            {...fields.description}
            floatingLabelText="Description"
          />
          <br />
          <TextField
            {...fields.image}
            type="file"
            floatingLabelText="image"
            floatingLabelText="Image"
            value={null}
            fullWidth
          />
          <img src={item && item.image || './static/placeholder.jpg'} alt={item && item.name} width="250" height="200" />
          <br />
          <IconButton onTouchTap={cancelEditing} touch>
            <Cancel />
          </IconButton>
          <IconButton
            onTouchTap={() => {
              this._updateItem();
              cancelEditing();
            }}
            touch
          >
            <Done />
          </IconButton>
        </div>
      );
    }

    return (
      <TableRow key={item.id} selected={selected}>
        <TableRowColumn>
          <TextField // FIXME: number fields accepts 0 value
            {...fields.id}
            floatingLabelText="ID"
            type="number"
            min={1}
            step={1}
          />
        </TableRowColumn>
        <TableRowColumn>
          <AutoComplete
            {...fields.name}
            floatingLabelText="Item Name"
            searchText={fields.name.value}
            dataSource={itemsName}
            filter={AutoComplete.fuzzyFilter}
            openOnFocus
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            {...fields.cost}
            floatingLabelText="Product Cost"
            type="number"
            min={1}
            step="any"
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            {...fields.sellingPrice}
            floatingLabelText="Selling Price"
            type="number"
            min={1}
            step="any"
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            type="number"
            step="any"
            floatingLabelText="Stock"
            {...fields.stock}
            onFocus={this._onFocus}
            autoFocus
          />
        </TableRowColumn>
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
