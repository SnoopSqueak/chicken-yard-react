import React, { Component } from 'react';
import './App.css';
import Yard from './components/Yard';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Yard width={640} height={480} numChickens={30} msPerTick={400} />
      </div>
    );
  }
}

export default App;
