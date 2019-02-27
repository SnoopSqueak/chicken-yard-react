import React, { Component } from 'react';
import './App.css';
import Yard from './components/Yard';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msPerTick: 150,
      oldTimeout: null
    };
    this.resizeListeners = [];
  }

  componentDidMount () {
    console.log("Ignore the 'setTimeout' handler violations. You see nothing!");
    // this is a ridiculous workaround just to get the position of the yard...
    this.timeout = setTimeout(this.handleResize.bind(this), 500);
    window.addEventListener('resize', () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(this.handleResize.bind(this), 500);
    });
  }

  handleResize () {
    this.forceUpdate();
    this.resizeListeners.forEach(element => {
      element.hotfix();
    });
    this.timeout = null;
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

  registerResize (element) {
    this.resizeListeners.push(element);
  }

  render() {
    return (
      <div className="App">
        <div className="flexrow">
          <Yard width={640} height={480} numChickens={30} msPerTick={this.state.msPerTick} registerResize={this.registerResize.bind(this)}/>
          <div className="controls">
            <button onClick={() => this.goSlower()}>Slower</button>
            <h3>{this.state.msPerTick} ms per tick</h3>
            <button onClick={() => this.goFaster()}>Faster</button>
          </div>
        </div>

        <div className="flexrow">
          <a href="https://youtu.be/ELuYVQLJUsM" target="_blank" rel="noopener noreferrer">Play for maximum effect</a>
        </div>
      </div>
    );
  }
}

export default App;
