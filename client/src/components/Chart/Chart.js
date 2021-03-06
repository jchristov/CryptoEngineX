import React from 'react';

import ChartType from './ChartType';
import { getData, getNewData } from './utils';

import { TypeChooser } from 'react-stockcharts/lib/helper';
import { FoldingCube } from 'better-react-spinkit';
import './Chart.css';

class Chart extends React.Component {
  constructor() {
    super();

    this.state = {
      data: [],
      isMounted: false,
    };
  }

  async componentDidMount() {
    const { exchange, market, timespan } = this.props.options;

    let newData = await getData(exchange, market, timespan);

    this.setState({ data: [...newData], isMounted: true }, () => {
      if (this.state.isMounted) {
        this.fetchData(exchange, market);
      }
    });
  }

  fetchData(exchange, market) {
    this.interval = setInterval(() => {
      getNewData(exchange, market).then(newData => {
        let sorted = this.state.data
          .concat(newData)
          .sort((a, b) => a.date.valueOf() - b.date.valueOf());
        this.setState({ data: sorted });
      });
    }, 5000);
  }

  componentWillUnMount() {
    clearInterval(this.interval);
    this.setState({ isMounted: false });
  }

  render() {
    if (this.state.data.length === 0) {
      return (
        <div className="chart-spinner">
          {' '}
          <FoldingCube size={40} color="gray" />{' '}
        </div>
      );
    }

    return <ChartType type="hybrid" data={this.state.data} />;
  }
}

export default Chart;
