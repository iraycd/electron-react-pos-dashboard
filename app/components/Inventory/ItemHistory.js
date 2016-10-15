import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class ItemHistory extends Component {
  static propTypes = {
    name: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { item, actions, } = this.props;

    actions.fetchItemHistory(item.id);
  }

  render() {
    const { closeHistory, item, } = this.props;
    return (
      <div>
        <button onClick={closeHistory}>Close</button>
        <ul>
          {_.values(item.history).map(({ category, time, details }) => {
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
