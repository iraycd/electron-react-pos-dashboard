import React, { Component, PropTypes } from 'react';
import {
  Line as LineChart,
  Bar as BarChart,
  Radar as RadarChart,
  PolarArea as PolarAreaChart,
  Pie as PieChart,
  Doughnut as DoughnutChart
} from 'react-chartjs';

import Paper from 'material-ui/Paper';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  }
};

export default class Sales extends Component {
  static propTypes = {
  }

  render() {
    const data = {
      labels: [
        'Red',
        'Green',
        'Yellow'
      ],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
    };

    return (
      <div>
        <Paper style={styles.container}>
          <LineChart data={data} width="800" height="600" />
        </Paper>
      </div>
    );
  }
}
