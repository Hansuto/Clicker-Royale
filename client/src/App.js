import React, { Component } from 'react';
import './App.css';
import { Grid, Segment, Button } from 'semantic-ui-react';
import Head from './components/head';
import Leaderboard from './components/leaderboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInProgress: false,
      timeLeft: 59,
      leaderboard: [
        {
          name: 'Rob',
          score: 420,
        },
        {
          name: 'Chris',
          score: 69,
        },
      ],
      myScore: 420,
    }
  }

  render() {
    const { gameInProgress, timeLeft, myScore, leaderboard } = this.state;
    return (
      <Segment className="App">
        <Grid centered className="flex fillHeight">
          <Grid.Row columns='1' className="flexShrink">
            <Head playing={gameInProgress} time={timeLeft} />
          </Grid.Row>
          <Grid.Row columns='2' className="flexGrow">
            <Grid.Column width='10'>
              <Button fluid color='pink' size='massive' className="fillHeight">{myScore}</Button>
            </Grid.Column>
            <Grid.Column width='6'>
              <Leaderboard data={leaderboard} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default App;
