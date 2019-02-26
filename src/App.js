import React, { Component } from 'react';
import './App.css';
import Yard from './components/Yard';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msPerTick: 200
    };
  }
  goFaster() {
    if (this.state.msPerTick <= 0) {
      alert("We're givin' her all she's got, cap'n!")
    } else {
      this.setState({msPerTick: this.state.msPerTick-25});
    }
  }
  goSlower() {
    this.setState({msPerTick: this.state.msPerTick+25});
  }
  render() {
    return (
      <div className="App">
        <Yard width={640} height={480} numChickens={30} msPerTick={this.state.msPerTick} />
        <div className="controls">
          <button onClick={() => this.goSlower()}>Slower</button>
          <h3>{this.state.msPerTick} ms per tick</h3>
          <button onClick={() => this.goFaster()}>Faster</button>
        </div>
      </div>
    );
  }
}

export default App;
