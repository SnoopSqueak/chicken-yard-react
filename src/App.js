// HEY! Make sure to check out the README if you'd like to know what order
//   I recommend checking out each component. Of course, it's just a suggestion.
//   Do what you want and have fun learning React! :-)

// The App component doesn't have many dependencies.
import React, { Component } from 'react';
import './App.css';
import Yard from './components/Yard';

class App extends Component {
  // You don't always need a constructor function, but if you include one,
  //   be sure to give it a `props` parameter and call `super(props)` to
  //   pass them to the underlying Component instance.
  constructor(props) {
    super(props);
    this.state = {
      // Number of milliseconds between each "tick", or app update.
      //   The higher this number, the more time between updates, the slower
      //   things happen in the app... but the better the performance.
      //   Extremely small values can cause interesting issues.
      msPerTick: 150,
      // This actually isn't needed anymore, whoops! it was used to store a
      //   reference to the timeout before I settled on `this.timeout` instead.
      oldTimeout: null
    };
    // This array will store any components that should re-draw themselves
    //   after the window is resized. React doesn't handle that for you, and
    //   it's difficult to monitor the position of an HTML element with
    //   JavaScript. My solution is probably not ideal either, but it works...
    this.resizeListeners = [];
  }

  // This is a built-in lifecycle event. Every React Component can have a
  //   `componentDidMount` function that will run after the component
  //   has been mounted to the DOM.
  componentDidMount () {
    // I was able to resolve every other console error or warning I found,
    //   but it seems I can't do much about these violations. Including a
    //   cheeky console message is optional.
    console.log("Ignore the 'setTimeout' handler violations. You see nothing!");
    // `this.timeout` stores a reference to the timeout created by calling
    //   `setTimeout`. `setTimeout` takes in a callback function and the number
    //   of milliseconds until that callback is called. Here I'm passing the
    //   `handleResize` function to run half a second after this component
    //   mounted so that I'm reasonably sure everything is fully in place before
    //   re-drawing this component and its children.
    // I use a lot of `bind` throughout this project. Just about any time I'm
    //   passing a function reference as a callback, I bind the current value
    //   of `this` so that it will still work even when called from other
    //   components or by JavaScript for some reason, like a timeout event.
    // Most of the time, an arrow function would also work instead of `bind`.
    this.timeout = setTimeout(this.handleResize.bind(this), 500);
    // The previous line will run the `handleResize` function shortly after
    //   this component is mounted. This next part will add an event listener
    //   so that `handleResize` also runs whenever the window is resized.
    window.addEventListener('resize', () => {
      // If we already have a timeout created, clear the old timeout and
      //   make a new one. If we kept creating multiple timeouts instead,
      //   it would result in choppy performance when dragging the edge
      //   of the window around.
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(this.handleResize.bind(this), 500);
    });
  }

  // This function runs half a second after this component is mounted, and also
  //   half a second after the window has been resized.
  handleResize () {
    // This re-draws the App component to fit the new size.
    this.forceUpdate();
    // This re-draws each element in the `resizeListeners` array. So far I'm
    //   only using it for the Yard component that App renders.
    this.resizeListeners.forEach(element => {
      // `hotfix` is not a great name for a function. I wish I didn't need that
      //   function at all. Maybe there's a way, but I couldn't find it this
      //   time. I could spend forever fixing up this app, but I wanted to
      //   finish it for the video.
      element.hotfix();
    });
    // The timeout's callback was executed, time to clear the timeout variable
    //   so App won't try to clear it the next time the window is resized.
    this.timeout = null;
  }

  // This is the event handler for the "Faster" button.
  goFaster() {
    // If the number of milliseconds between ticks is already 0, don't
    //   go any lower and tell the user why.
    // Otherwise, reduce the number of milliseconds between ticks by 25.
    if (this.state.msPerTick <= 0) {
      alert("We're givin' her all she's got, cap'n!")
    } else {
      this.setState({msPerTick: this.state.msPerTick-25});
    }
  }

  // This is the event handler for the "Slower" button.
  goSlower() {
    // I didn't put a cap on Slower. What might happen? Beats me!
    this.setState({msPerTick: this.state.msPerTick+25});
  }

  // This function can be passed to child components. The children can call
  //   this function from their props to register themselves with App. Any
  //   elements stored in `resizeListeners` will have their `hotfix` functions
  //   executed if the window is resized.
  registerResize (element) {
    this.resizeListeners.push(element);
  }

  // Every component needs a render function!
  render() {
    return (
      // Every render function should return a single containing element. That
      //   element can contain multiple children, including siblings, but the
      //   top level returned by `render` must be a single element. It can be
      //   any element. Here, it's a div. Inside of that div are two more divs.
      <div className="App">
        // I made a "flexrow" class to help style these with CSS. The Yard and
        //   controls go in one row, while the video link gets its own row
        //   underneath.
        <div className="flexrow">
          // Check out the Yard component definition to see what it will do
          //   with these props.
          <Yard width={640} height={480} numChickens={30} msPerTick={this.state.msPerTick} registerResize={this.registerResize.bind(this)}/>
          // The "controls" class is given 25% width. This is to prevent the
          //   size of the elements from shifting slightly when the text in
          //   the h3 changes; for example, from "75 ms per tick" to "100 ms
          //   per tick" adds another character, which used to nudge the Yard
          //   component away a little to make it fit. The "controls" class
          //   also has "align-self: center", which centers an element in a
          //   "display: flex" container both horizontally and vertically.
          <div className="controls">
            // The "Slower" button uses App's `goSlower` function as a click
            //   event handler. Each time the button is clicked, `goSlower` runs.
            <button onClick={() => this.goSlower()}>Slower</button>
            // Useful information for the user. It helps to remember that
            //   1000 ms is equal to 1 second. 1 second between ticks is pretty
            //   slow. An app running at 60 frames per second would take about
            //   16.67 ms to render each frame. I don't think React is
            //   particularly well-suited toward that kind of rapid updating,
            //   at least not on a large scale, but I thought a game-like
            //   application would be fun to develop.
            <h3>{this.state.msPerTick} ms per tick</h3>
            // The "Faster" button uses App's `goFaster` function as a click
            //   event handler.
            <button onClick={() => this.goFaster()}>Faster</button>
          </div>
        </div>

        <div className="flexrow">
          // In case YouTube takes this video down (I didn't upload it, but
          //   it's probably breaking copyright law), the video was a song
          //   called "Cluck Old Hen", played by Holly Golightly & the Broke-offs.
          // It's an interesting song... The video featured footage of various
          //   chickens.
          <a href="https://youtu.be/ELuYVQLJUsM" target="_blank" rel="noopener noreferrer">Play for maximum effect</a>
        </div>
      </div>
    );
  }
}

// Don't forget to export your component! Otherwise other parts of your
//   application (like index.js in this case) won't be able to use it.
export default App;
