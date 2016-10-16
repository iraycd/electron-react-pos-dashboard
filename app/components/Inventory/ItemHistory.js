import React, { Component, PropTypes } from 'react';

export default class ItemHistory extends Component {
  static propTypes = {
    name: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { item, actions, selectedIndex, } = this.props;
    console.log(selectedIndex);
    actions.fetchItemHistory(selectedIndex, item.id);
  }

  componentWillReceiveProps(nextProps) {
    const { item, actions, } = this.props;
    if (item.id !== nextProps.item.id) {
      actions.fetchItemHistory(nextProps.selectedIndex, nextProps.item.id);
    }
  }

  render() {
    const { closeHistory, item: { history = [] }, } = this.props;
    return (
      <div>
        <button onClick={closeHistory}>Close</button>
        <ul>
          {history.map(({ category, time, details }) => {
            return (
              <li>
                [{category}]{time} - {details}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
