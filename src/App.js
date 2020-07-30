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
import Konami from 'react-konami-code';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = socketIOClient("https://clicker-royale-server.herokuapp.com");


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
      hiScore: 0,
      hiScoreName: '',
      noname: false,
      nameOpen: true,
      increment: 1,
    }
  }

  inputChange = (e, {value}) => {
    this.setState({ myName: value });
  }

  submitName = () => {
    const { myName, increment } = this.state;

    if (myName === '') {
      this.setState({ noname: true });
    }
    else {
      this.setState({ nameOpen: false });
      this.updateSocket();
      let data = JSON.stringify({
        name: myName,
        increment: increment,
      });
      socket.emit('join', data);
    }
  }

  handleClick = () => {
    const { myName, increment } = this.state;
    let data = JSON.stringify({
      name: myName,
      increment: increment,
    });
    socket.emit('click', data);
  }

  hurt = (name) => {
    const { increment } = this.state;
    console.log('You hurt '+ name);
    let data = JSON.stringify({
      name: name,
      increment: -increment,
    });
    socket.emit('click', data);
  }

  updateSocket() {
    const { myName, myScore } = this.state;

    socket.on("update", data => {
      var response = JSON.parse(data);
      // console.log(response);

      var timeLeft = response.timeLeft;
      var currentGameStatus = response.gameInProgress;
      var leaderboard = response.leaderboard;
      var newWinner = response.winner;
      var hiScore = response.hiScore;
      var hiScoreName = response.hiScoreName
      var score = 0;


      if (leaderboard.length !== 0) {
        score = leaderboard.find(x => x.name === myName)?.score;
      }

      if (myScore === null) {
        score = myScore;
      }

      if (this.state.gameInProgress === true && currentGameStatus === false && leaderboard.length !== 0) 
        toast("🎉 " + newWinner + " is the winner! 🎉");

      this.setState({
        gameInProgress: currentGameStatus,
        timeLeft: timeLeft,
        leaderboard: leaderboard,
        myScore: score,
        lastWinner: newWinner,
        hiScore: hiScore,
        hiScoreName: hiScoreName
      })
    })
  }

  easterEgg = () => {
    console.log('God Mode');
    toast("🎮 Konami Code 🎮", {pauseOnHover: false, closeOnClick: false});
    this.setState({ increment: 10 });
  }

    componentDidMount() {
        console.log('Initializing WebSocket...')
        this.updateSocket();
    }

  render() {
    const { gameInProgress, timeLeft, myScore, leaderboard, myName, noname, nameOpen, lastWinner, hiScoreName, hiScore } = this.state;

    let notify = (gameInProgress) ? 'Time Remaining: ' : 'Game Starting in: ';
    let notifyText = notify + timeLeft + ' seconds';
    let btnTxt = (gameInProgress && myScore === 0) ? 'Click' : (gameInProgress) ? myScore : notifyText;
    return (
      <div className="App noTextSelect" basic>
        <div>
            <Header textAlign='center' size='huge' color='violet'>Clicker Royale</Header>
            <Header textAlign='center'>{notifyText}</Header>
            <Header textAlign='center'>Last Winner: <Label basic color='purple' size='large'>{lastWinner}</Label></Header>
            <Header textAlign='center'>High Score: <Label basic color='purple' size='large'>{hiScoreName}</Label> <Label basic color='purple' size='large'>{hiScore}</Label></Header>
        </div>
        <div className="gameContainer">
            <div className="clickButtonContainer">
              <Button fluid color='purple' size='massive' className="fillHeight" onClick={this.handleClick} disabled={!gameInProgress}>
                <Header size='huge' inverted>
                  {btnTxt}
                </Header>
              </Button>
            </div>
            <div className="leaderboardContainer">
              <Leaderboard data={leaderboard} client={myName} hurt={(name) => this.hurt(name)} />
            </div>
        </div>
        <Modal open={nameOpen} size='mini' closeOnDimmerClick={false} className="noTextSelect">
          <Modal.Header>What should we call you?</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.submitName}>
              <Form.Input placeholder='Name' value={myName} onChange={this.inputChange} error={noname} fluid autoFocus />
              <Form.Button type='submit' color='purple' fluid>Submit</Form.Button>
            </Form>
          </Modal.Content>
        </Modal>
        <Konami action={this.easterEgg}></Konami>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
