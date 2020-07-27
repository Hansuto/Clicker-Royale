import React, { Component } from 'react';
import './App.css';
import {
  Grid,
  Segment,
  Button,
  Header,
  Modal,
  Form,
  Label,
} from 'semantic-ui-react';
import Leaderboard from './components/leaderboard';
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://hansuto.ngrok.io/");

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
      let data = JSON.stringify({
        name: myName,
        increment: 1,
      });
      socket.emit('click', data);
    }
  }

  handleClick = () => {
    const { myName } = this.state;
    let data = JSON.stringify({
      name: myName,
      increment: 1,
    });
    socket.emit('click', data);
  }

  hurt = (name) => {
    let data = JSON.stringify({
      name: name,
      increment: -1,
    });
    socket.emit('click', data);
  }

  updateSocket() {
    const { myName, myScore } = this.state;

    socket.on("update", data => {
      var response = JSON.parse(data);
      // console.log(response);

      var timeLeft = response.timeLeft;
      var gameInProgress = response.gameInProgress;
      var leaderboard = response.leaderboard;
      var lastWinner = response.winner;
      var score = 0;


      if (leaderboard.length !== 0) {
        score = leaderboard.find(x => x.name === myName)?.score;
      }

      if (myScore === null) {
        score = myScore;
      }

      // console.log(score);

      this.setState({
        gameInProgress: gameInProgress,
        timeLeft: timeLeft,
        leaderboard: leaderboard,
        myScore: score,
        lastWinner: lastWinner,
      })
    })
  }

  render() {
    const { gameInProgress, timeLeft, myScore, leaderboard, myName, noname, nameOpen, lastWinner } = this.state;

    let notify = (gameInProgress) ? 'Time Remaining: ' : 'Game Starting in: ';
    let notifyText = notify + timeLeft + ' seconds';
    let btnTxt = (!gameInProgress && myScore === 0) ? 'Join' : (gameInProgress) ? myScore : notifyText;
    return (
      <Segment className="App" basic>
        <Grid centered className="flex fillHeight">
          <Grid.Row columns='1' className="flexShrink">
            <div>
              <Header textAlign='center' size='huge' color='violet'>Clicker Royale</Header>
              <Header textAlign='center'>{notifyText}</Header>
              <Header textAlign='center'>Last Winner: <Label basic color='purple' size='large'>{lastWinner}</Label></Header>
            </div>
          </Grid.Row>
          <Grid.Row columns='2' className="flexGrow">
            <Grid.Column width='10'>
              <Button
                fluid
                color='purple'
                size='massive'
                className="fillHeight"
                onClick={this.handleClick}
                disabled={!gameInProgress && myScore !== 0}
              >
                <Header size='huge' inverted>
                  {btnTxt}
                </Header>
              </Button>
            </Grid.Column>
            <Grid.Column width='6'>
              <Leaderboard data={leaderboard} client={myName} hurt={(name) => this.hurt(name)} />
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
            <Form onSubmit={this.submitName}>
              <Form.Input placeholder='Name' value={myName} onChange={this.inputChange} error={noname} fluid autoFocus />
              <Form.Button type='submit' color='purple' fluid>Submit</Form.Button>
            </Form>
          </Modal.Content>
        </Modal>
      </Segment>
    );
  }
}

export default App;
