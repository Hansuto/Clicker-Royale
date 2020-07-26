import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class Leaderboard extends Component {

  generateHeaders = () => {
    return (
      <Table.Row>
        <Table.HeaderCell>Pos</Table.HeaderCell>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Score</Table.HeaderCell>
      </Table.Row>
    )
  }

  generateRow = (obj, index) => { // generates a row in the table
    console.log(obj);
    return ( // returns a row element
      <Table.Row key={index}>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{obj.name}</Table.Cell>
        <Table.Cell>{obj.score}</Table.Cell>
      </Table.Row>
    )
  }

  render() {
    return (
      <Table
        // sortable
        celled
        striped
        singleLine
        // selectable
        // collapsing
        padded
        // compact={isMobileOnly}
        unstackable
        // className="transTable"
        size="large"
        inverted
        color='red'
        tableData={this.props.data}
        headerRow={this.generateHeaders()}
        renderBodyRow={this.generateRow}
      >
      </Table>
    );
  }
}

export default Leaderboard;
