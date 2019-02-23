import React, { Component } from 'react';
import './App.css';
import Yard from './components/Yard';
// <Yard width={640} height={480} numChickens={10000} />
class App extends Component {
  render() {
    return (
      <div className="App">
        <Yard width={640} height={480} numChickens={10} msPerTick={200} />
      </div>
    );
  }
}

export default App;
