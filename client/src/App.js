import React, { Component } from 'react';
import './App.css';
import {
  Grid,
  Segment,
  Button,
  Modal,
  Input,
} from 'semantic-ui-react';
import Head from './components/head';
import Leaderboard from './components/leaderboard';
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://hansuto.ngrok.io/")

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInProgress: false,
      timeLeft: '-',
      leaderboard: [],
      myScore: 0,
      myName: '',
      lastWinner: '',
      noname: false,
      nameOpen: true,
    }
  }

  inputChange = (e, {value}) => {
    this.setState({ myName: value });
  }

  submitName = () => {
    const { myName } = this.state;

    if (myName === '') {
      this.setState({ noname: true });
    }
    else {
      this.setState({ nameOpen: false });
      this.updateSocket();
      socket.emit('click', myName);
    }
  }

  handleClick = () => {
    const { myName } = this.state;
    socket.emit('click', myName);
  }

  updateSocket() {
    const { myName } = this.state;

    socket.on("update", data => {
      var response = JSON.parse(data);
      console.log(response);

      var timeLeft = response.timeLeft;
      var gameInProgress = response.gameInProgress;
      var leaderboard = response.leaderboard;
      var lastWinner = response.winner;
      var myScore;

      if (leaderboard.length !== 0 && gameInProgress) {
        myScore = leaderboard.find(x => x.name === myName).score;
      }

      this.setState({
        gameInProgress: gameInProgress,
        timeLeft: timeLeft,
        leaderboard: leaderboard,
        myScore: myScore,
        lastWinner: lastWinner,
      })
    })
  }

  render() {
    const { gameInProgress, timeLeft, myScore, leaderboard, myName, noname, nameOpen } = this.state;
    return (
      <Segment className="App">
        <Grid centered className="flex fillHeight">
          <Grid.Row columns='1' className="flexShrink">
            <Head playing={gameInProgress} time={timeLeft} />
          </Grid.Row>
          <Grid.Row columns='2' className="flexGrow">
            <Grid.Column width='10'>
              <Button
                fluid
                color='purple'
                size='massive'
                className="fillHeight"
                onClick={this.handleClick}
                disabled={!gameInProgress || myName === ''}
              >
                {myScore}
              </Button>
            </Grid.Column>
            <Grid.Column width='6'>
              <Leaderboard data={leaderboard} client={myName} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          open={nameOpen}
          size='mini'
          closeOnDimmerClick={false}
        >
          <Modal.Header>What should we call you?</Modal.Header>
          <Modal.Content>
            <Input placeholder='Name' value={myName} onChange={this.inputChange} error={noname} fluid />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.submitName} primary fluid>Submit</Button>
          </Modal.Actions>
        </Modal>
      </Segment>
    );
  }
}

export default App;
