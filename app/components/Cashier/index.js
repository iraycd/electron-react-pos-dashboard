import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import Paper from 'material-ui/Paper';
import { GridList, GridTile } from 'material-ui/GridList';
import AppBar from 'material-ui/AppBar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Back from 'material-ui/svg-icons/hardware/keyboard-backspace';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import Cancel from 'material-ui/svg-icons/content/clear';
import ViewList from 'material-ui/svg-icons/action/view-list';
import Info from 'material-ui/svg-icons/action/info-outline';
import RemoveCart from 'material-ui/svg-icons/action/remove-shopping-cart';
import styles from './styles';

@Radium
export default class Cashier extends Component {
  static propTypes = {
  }

  constructor() {
    super();

    this.state = {
      isQuantifying: false,
      isUpdating: false,
      selectedItem: {},
      quantity: 1,
      quantityError: '',
    };
  }

  componentWillMount() {
    const {
      params,
      reports,
      actions,
      items,
    } = this.props;
    console.log(params.timestamp);
    if (params.timestamp) {
      const date = new Date(params.timestamp.slice(0, -3) * 1000)
        .toLocaleDateString()
        .replace(/\//g, '-');

      const reportCart = reports[date][params.timestamp].cart.map((rItem) => {
        const rItemIndex = items.map((item) => item.id)
          .indexOf(rItem.id);

        return {
          ...rItem,
          stock: items[rItemIndex].stock
        };
      });

      actions.addReportCart(reportCart);
    }

    actions.fetchInventoryItems();
  }

  _toggleQuantifying = (prop = {}, isUpdating = false, next) => {
    const { props: { cart }, state } = this;

    this.setState({
      isQuantifying: !state.isQuantifying,
      selectedItem: prop,
      quantity: prop.quantity || 1,
      quantityError: '',
      isUpdating,
    });

    if (!isUpdating && next) {
      next(state.selectedItem);
    }
  }

  _handleQuantity = (e = { target: { value: 1 } }) => {
    const { state } = this;
    const value = +e.target.value;

    if (value > state.selectedItem.stock) {
      this.setState({
        quantityError: `The maximum value is ${state.selectedItem.stock}`,
      });
    } else if (value === 0) {
      this.setState({
        quantity: value,
        quantityError: 'The minimum value is 1',
      });
    } else {
      this.setState({
        quantity: value,
        quantityError: '',
      });
    }
  }

  _submitQuantity = (e) => {
    e.preventDefault();
    const { state } = this;
    const { actions } = this.props;
    const { selectedItem, quantity } = state;
    const item = { ...selectedItem, quantity };

    if (!state.quantityError && selectedItem !== undefined) {
      actions.addCartItem(item);
      this._handleQuantity();
      this._toggleQuantifying();
    }
  }

  _updateCartItem = (e) => {
    e.preventDefault();
    const { state } = this;
    const { actions } = this.props;

    if (!state.quantityError) {
      this._toggleQuantifying(false, null, (selectedItem) => {
        actions.updateCartItem(selectedItem.id, state.quantity);
        this.setState({ isUpdating: false });
      });
    }
  }

  _submitCart = (cart) => {
    const { actions, reports, params } = this.props;
    let reportCart = false;

    if (params.timestamp) {
      const date = new Date(params.timestamp.slice(0, -3) * 1000)
        .toLocaleDateString()
        .replace(/\//g, '-');

      reportCart = {
        cart: reports[date][params.timestamp].cart,
        timestamp: params.timestamp,
      };
    }

    if (cart.length !== 0) {
      actions.submitCart(cart, reportCart, (err, msg) => {
        if (err) actions.toggleSnackbar(`Error: ${err}`);
        else actions.toggleSnackbar(`${msg} was synced.`);
      });
    }
  }

  render() {
    const {
      props: {
        cashier: {
          selectedCategory,
          snackMessage,
        },
        items,
        tiles,
        cart,
        actions,
      },
      state,
    } = this;

    const isCartItem = (id) => (
      cart.map((item) => item.id)
        .indexOf(id) > -1
    );

    return (
      <div onKeyUp={console.log}>
        <Snackbar
          open={snackMessage}
          message={snackMessage}
          autoHideDuration={4000}
          onRequestClose={() => actions.toggleSnackbar('')}
        />
        <Dialog
          title={`${state.selectedItem.name} Quantity`}
          open={state.isQuantifying}
          onRequestClose={this._toggleQuantifying}
          contentStyle={styles.quantity}
          titleStyle={styles.quantityTitle}
        >
          <form onSubmit={state.isUpdating ? this._updateCartItem : this._submitQuantity}>
            <TextField
              type="number"
              step="any"
              min={1}
              name="quantity"
              value={state.quantity}
              onChange={this._handleQuantity}
              onFocus={(e) => e.target.select()}
              errorText={state.quantityError}
              inputStyle={styles.quantityFont}
              fullWidth
              autoFocus
            />
            <RaisedButton
              type="submit"
              label="Done"
              primary
              style={{ width: '100%' }}
            />
            <h5 style={{ margin: 0 }}>
              Subtotal: ₱{state.quantity * state.selectedItem.sellingPrice}
              <span className="pull-right">
                Stock: {`${Math.floor(state.selectedItem.stock - state.quantity)}/${Math.floor(state.selectedItem.stock)}`}
              </span>
              {state.selectedItem.feet ?
                <span className="pull-right">
                  Feet: {`${Math.floor(state.quantity * state.selectedItem.feet)}ft/${Math.floor(state.selectedItem.totalFeet)}ft`}&nbsp;
                </span>
                : null
              }
            </h5>
          </form>
        </Dialog>
        <div className="col-md-9" style={styles.interface}>
          <div className="col-md-12" style={{ padding: 0, marginBottom: 15 }}>
            <AppBar
              title={selectedCategory || 'Categories'}
              showMenuIconButton={selectedCategory !== ''}
              iconElementLeft={
                <IconButton onTouchTap={() => actions.selectCategory('')} touch>
                  <Back />
                </IconButton>
              }
            />
          </div>
          <div style={tiles.length > 0 ? styles.hide : styles.tilesLoader}>
            <CircularProgress size={2} />
          </div>
          <div className="col-md-12">
            <div style={styles.tilesContainer}>
              <GridList
                cols={4}
                cellHeight={220}
              >
                {tiles.map((tile, i) => (
                  <Paper
                    zDepth={2}
                    style={
                      isCartItem(tile.id) ?
                        styles.hide : styles.gridTilePaper
                    }
                  >
                    <GridTile
                      key={i}
                      title={
                        tile.name ?
                          <span style={{ fontSize: '2.5rem', }}>{tile.name}</span>
                          : <span style={{ fontSize: '2.5rem', }}>{tile}</span>
                      }
                      titlePosition={tile.name ? 'bottom' : 'top'}
                      onTouchTap={tile.name ? () => tile.stock && this._toggleQuantifying(tile) : () => actions.selectCategory(tile)}
                      style={styles.gridTile}
                      subtitle={
                        tile.sellingPrice ?
                          <h2 style={{ margin: 0 }}>
                            <span>Price: ₱<b>{Math.floor(tile.sellingPrice)}</b></span>
                            &nbsp; <br />
                            Stock: <b>{Math.floor(tile.stock) || 'Out of Stock'}</b>
                          </h2>
                          : <h2 style={{ margin: 0 }}>{items.filter((item) => item.category === tile).length} item/s</h2>
                      }
                      actionIcon={
                        tile.name ?
                          (<IconButton onTouchTap={(e) => e.stopPropagation()} touch>
                            <Info color="#EEEEEE" />
                          </IconButton>) :
                          (<IconMenu
                            onTouchTap={(e) => e.stopPropagation()}
                            iconButtonElement={<IconButton><ViewList color="#EEEEEE" /></IconButton>}
                            touch
                          >
                            {items.filter((item) => item.category === tile && cart.map((cItem) => cItem.id)
                              .indexOf(item.id) === -1)
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  onTouchTap={() => this._toggleQuantifying(item)}
                                  primaryText={item.name}
                                />))}
                          </IconMenu>)
                      }
                    >
                      <img
                        src={tile.image || tile.image === '' ? './static/placeholder.jpg' : './static/category.png'}
                        alt="placeholder"
                        style={styles.images}
                      />
                    </GridTile>
                  </Paper>
                ))}
              </GridList>
            </div>
          </div>
        </div>
        <Paper className="col-md-3">
          <Subheader style={{ height: '7vh' }}>
            <b>Cart</b>
            <IconButton
              tooltip="Clear cart"
              tooltipPosition="bottom-left"
              onTouchTap={actions.clearCart}
              style={{ float: 'right' }}
              touch
            >
              <RemoveCart />
            </IconButton>
          </Subheader>
          <List style={styles.cartList}>
            {cart.map((item) => {
              const subText = `₱${item.sellingPrice} x ${item.quantity} = ₱${item.sellingPrice * item.quantity}`;

              return (
                <ListItem
                  key={item.id}
                  primaryText={item.name}
                  secondaryText={subText}
                  onTouchTap={() => this._toggleQuantifying(item, true)}
                  leftAvatar={<Avatar src={item.image || './static/placeholder.jpg'} />}
                  rightIconButton={
                    <IconButton onTouchTap={() => actions.removeCartItem(item.id)} touch>
                      <Cancel />
                    </IconButton>
                  }
                />
              );
            })}
          </List>
          <Paper style={styles.total}>
            <RaisedButton
              children={
                <div style={styles.purchaseButton}>
                  <span style={{ position: 'absolute', top: 0, left: 10, fontSize: 20 }}>
                    Total:
                  </span>
                  ₱{cart.reduce((p, c) => p + (c.quantity * c.sellingPrice), 0).toLocaleString('en-US')}
                </div>
              }
              onTouchTap={() => this._submitCart(cart)}
              style={{ width: '100%', height: '100%' }}
              primary
            />
          </Paper>
        </Paper>
      </div>
    );
  }
}
