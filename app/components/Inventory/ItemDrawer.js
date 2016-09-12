import React, { Component, PropTypes } from 'react';

import ItemUpdate from './ItemUpdate';

import Drawer from 'material-ui/Drawer';

export default class ItemDrawer extends Component {
  constructor() {
    super();

    this.state = {
      isEditing: false,
    };
  }

  render() {
    const { open, item, items, initialValues, actions, closeItemDrawer } = this.props;

    if (this.state.isEditing) {
      return (
        <Drawer
          width={350}
          open={open}
          docked={false}
          onRequestChange={() => {
            this.setState({ isEditing: false });
            closeItemDrawer();
          }}
          openSecondary
        >
          <ItemUpdate
            {...this.props}
            cancelEditing={() => this.setState({ isEditing: false })}
            isItemDrawerEdit
          />
        </Drawer>
      );
    }

    return (
      <Drawer width={350} open={open} openSecondary>
        <button onClick={() => this.setState({ isEditing: true })}>Edit</button>
        <button onClick={closeItemDrawer}>Close</button>
        <br />
        ID: {item && item.id}
        <br />
        Name: {item && item.name}
        <br />
        Category: {item && item.category}
        <br />
        Brand: {item && item.brand}
        <br />
        Supplier: {item && item.supplier}
        <br />
        Feet: {item && item.feet}
        <br />
        Description: {item ? item.description : 'None'}
        <br />
        <img src={item && item.image || './static/placeholder.jpg'} alt={item && item.name} width="250" height="200" />
      </Drawer>
    );
  }
}
