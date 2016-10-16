import React, { Component, PropTypes } from 'react';

import ItemUpdate from './ItemUpdate';
import ItemHistory from './ItemHistory';

import Drawer from 'material-ui/Drawer';

export default class ItemDrawer extends Component {
  constructor() {
    super();

    this.state = {
      isEditing: false,
      isHistoryShowed: false,
    };
  }

  render() {
    const { open, item, initialValues, actions, closeItemDrawer, selectedIndex, } = this.props;

    return (
      <Drawer width={350} open={open} openSecondary>
        {(() => {
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

          if (this.state.isHistoryShowed) {
            return (
              <ItemHistory
                item={item}
                selectedIndex={selectedIndex}
                actions={actions}
                closeHistory={() => this.setState({ isHistoryShowed: false })}
              />
            );
          }

          return (
            <div>
              <button onClick={() => this.setState({ isEditing: true })}>Edit</button>
              <button onClick={() => this.setState({ isHistoryShowed: true })}>Show History</button>
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
            </div>
          );
        })()}
      </Drawer>
    );
  }
}
