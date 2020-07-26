import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

class Head extends Component {
  render() {
    let notify = (this.props.playing) ? 'Time Remaining: ' : 'Game Starting in: ';
    let text = notify + this.props.time + ' seconds';
    return (
      <div>
        <Header textAlign='center'>Clicker Royal</Header>
        <Header textAlign='center'>{text}</Header>
      </div>
    );
  }
}

export default Head;
