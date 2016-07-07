import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import styles from './styles';

@reduxForm({
  form: 'new_inventory_item',
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
},
(state) => ({
  initialValues: {
    id: Math.max(
      ...state.inventory.items.map(item => item.id)
    ) + 1,
    cost: 1,
    sellingPrice: 1,
    stock: 1,
    image: '',
    description: '',
  }
}))
export default class ItemSetup extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    suppliers: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired,
    addNewItem: PropTypes.func,
    fieldError: PropTypes.string,
  }

  constructor() {
    super();

    this.state = { openDialog: false };
  }

  _onBlurValidate = (e) => {
    const { fields, actions } = this.props;

    actions.validateField(e.target.name, e.target.value);
    fields.id.onBlur();
  }

  _addNewItem = (e) => {
    const {
      values,
      actions,
    } = this.props;

    e.preventDefault();
    actions.addNewItem(values);
    actions.reset('new_inventory_item');
  }

  _handleCategoriesDialog = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  _handleDialogState = (e) => {
    e.preventDefault();
    this.setState({ openDialog: !this.state.openDialog });
  }

  render() {
    const {
      fields,
      categories,
      brands,
      suppliers,
      disabled,
      fieldError,
      actions,
    } = this.props;

    const actionButtons = [
      <FlatButton
        label="Cancel"
        onTouchTap={(e) => {
          this._handleDialogState(e);
          actions.reset('new_inventory_item');
        }}
        primary
      />,
      <FlatButton
        type="submit"
        label="Submit"
        onTouchTap={this._addNewItem}
        primary
      />
    ];

    return (
      <div>
        <FlatButton
          label="Add"
          onTouchTap={this._handleDialogState}
          disabled={disabled}
          primary
        />
        <Dialog
          title="Item Setup"
          actions={actionButtons}
          open={this.state.openDialog}
          contentStyle={styles.dialog}
          titleStyle={styles.title}
          autoScrollBodyContent
        >
          <form onSubmit={this._addNewItem}>
            <TextField
              {...fields.id}
              type="number"
              min={1}
              step="any"
              name="id"
              floatingLabelText="Item ID"
              errorText={fieldError}
              onBlur={this._onBlurValidate}
              fullWidth
              autoFocus
            />
            <br />
            <TextField
              {...fields.name}
              floatingLabelText="Item Name"
              fullWidth
            />
            <br />
            <TextField
              {...fields.image}
              type="file"
              value={null}
              floatingLabelText="image"
              fullWidth
            />
            <br />
            <AutoComplete
              {...fields.category}
              floatingLabelText="Category"
              filter={AutoComplete.fuzzyFilter}
              dataSource={categories}
              onUpdateInput={val => fields.category.onChange(val)}
              onNewRequest={val => {
                setTimeout(() => this.refs.brandField.focus(), 500);
                fields.category.onChange(val);
              }}
              fullWidth
              openOnFocus
            />
            <br />
            <AutoComplete
              {...fields.brand}
              floatingLabelText="Brand"
              ref="brandField"
              filter={AutoComplete.fuzzyFilter}
              dataSource={brands}
              onUpdateInput={val => fields.brand.onChange(val)}
              onNewRequest={val => {
                setTimeout(() => this.refs.supplierField.focus(), 500);
                fields.brand.onChange(val);
              }}
              fullWidth
              openOnFocus
            />
            <br />
            <AutoComplete
              {...fields.supplier}
              floatingLabelText="Supplier"
              ref="supplierField"
              filter={AutoComplete.fuzzyFilter}
              dataSource={suppliers}
              onUpdateInput={val => fields.supplier.onChange(val)}
              onNewRequest={val => {
                setTimeout(() => this.refs.costField.focus(), 500);
                fields.supplier.onChange(val);
              }}
              fullWidth
              openOnFocus
            />
            <br />
            <TextField
              {...fields.cost}
              type="number"
              min={1}
              step="any"
              ref="costField"
              floatingLabelText="Product Cost"
              fullWidth
            />
            <br />
            <TextField
              {...fields.sellingPrice}
              type="number"
              min={1}
              step="any"
              floatingLabelText="Selling Price"
              fullWidth
            />
            <br />
            <TextField
              {...fields.stock}
              type="number"
              min={1}
              step="any"
              floatingLabelText="Stock"
              fullWidth
            />
            <br />
            <TextField
              {...fields.description}
              type="textarea"
              floatingLabelText="Description"
              fullWidth
            />
            <input className="hidden" type="submit" />
          </form>
        </Dialog>
      </div>
    );
  }
}
