// HEY! Make sure to check out the README if you'd like to know what order
//   I recommend checking out each component. Of course, it's just a suggestion.
//   Do what you want and have fun learning React! :-)

// We've reached the end of our tour if you were following along with README.

// The Bush component is the simplest of all, Actor does most of the work. If
//   you've made it this far, I doubt I have to explain much about the
//   following code to you. I hope you've enjoyed exploring my project, and
//   I encourage you to make it your own project if you feel so inclined.

// Development isn't always fun. It can be very difficult. Often, it's both.

// Enjoy challenging yourself. Take the bad with the good. Never give up!

import React, { Component } from 'react';
import Actor from './Actor';
class Bush extends Component {

  render() {
    return (
      <Actor
        className="bush"
        imageName="bush"
        x={this.props.x}
        y={this.props.y}
        left={this.props.left}
        top={this.props.top}
        registerActor={(actor) => this.props.registerActor(actor)}
      />
    );
  }
}

export default Bush;

// - Mike
