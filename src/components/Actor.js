// HEY! Make sure to check out the README if you'd like to know what order
//   I recommend checking out each component. Of course, it's just a suggestion.
//   Do what you want and have fun learning React! :-)

// The only dependencies are React and Component. We've hit rock bottom!
import React, { Component } from 'react';
class Actor extends Component {
  constructor (props) {
    super(props);
    // Randomize the direction. See Chicken for mentions of radians and trig.
    let direction = Math.random() * Math.PI * 2;
    this.state = {
      x: this.props.x || 0,
      y: this.props.y || 0,
      pose: this.props.pose,
      frame: this.props.frame || 0,
      direction: this.props.direction || direction,
      // Set facing based on the randomized direction, even though chickens
      //   never start in the walking pose and never move in the first direction.
      // I could just as easily use a random -1 or 1 here, but I did it this way
      //   just in case I later decide that chickens can start off walking.
      facing: this.props.facing || Math.cos(direction) > 0 ? 1 : -1
    };
    this.msPerTick = this.props.msPerTick;
  }

  componentDidMount () {
    // Shorthand `if` syntax. You don't need curly braces if you're only
    //   executing one statement. Here, I only want to set an interval if the
    //   parent component passed in `msPerTick`. If they did, this sets up
    //   an interval that will call the `tick` function each time `msPerTick`
    //   milliseconds go by.
    if (this.msPerTick) this.interval = setInterval(() => this.tick(this.props.msPerTick), this.msPerTick);
    // Call the `registerActor` function passed in from the parent so that they
    //   can control this actor. This is a common way of circumventing React's
    //   one-way data flow.
    this.props.registerActor(this);
  }

  componentWillUnmount () {
    // If for some reason this component is unmounted, clear the interval so
    //   JavaScript doesn't have to track it anymore.
    if (this.interval) clearInterval(this.interval);
  }

  tick (elapsedTime) {
    // If the parent passed in their own `tick` function, run it!
    if (this.props.tick) this.props.tick(elapsedTime);
    // If the number of `msPerTick` has changed since the last tick, update
    //   `this.msPerTick` to match, clear the old interval, and set a new one.
    if (this.props.msPerTick !== this.msPerTick) {
      clearInterval(this.interval);
      this.msPerTick = this.props.msPerTick;
      this.interval = setInterval(() => this.tick(this.msPerTick), this.msPerTick);
    }
  }

  getStyle () {
    return {
      // This part takes short strings like "cluck" and "bush" and grabs
      //   the corresponding image from the images folder.
      background: `url("/assets/images/${this.props.imageName}.png")`,
      // background-position tells the browser which part of the image to show.
      // Here we're scrolling it by an amount equal to the current animation
      //   frame * 100%. It has to be negative or it won't work properly. I
      //   guess you can think of it as scrolling the image to the left rather
      //   than scrolling our view of the image to the right.
      backgroundPosition: (-this.state.frame * 100) + "% 0%",
      // This is important for sprite art! My sprites aren't the prettiest,
      //   but they would look a lot worse without this.
      imageRendering: 'pixelated',
      // With relative positioning, the chickens and bushes would offset each
      //   other, breaking the whole world.
      position: 'absolute',
      // `this.state.facing` should be either 1 or -1. If it's -1, the image
      //   will be flipped horizontally by this transform.
      transform: `scaleX(${this.state.facing})`,
      // Starting at the top left corner (or (0, 0) if no top or left was
      //   provided), add the x and y coordinates (or (0, 0) if none were
      //   provided). Better than throwing an error!
      top: (this.props.top || 0) + (this.state.y || 0),
      left: (this.props.left || 0) + (this.state.x || 0),
      width: '32px',
      height: '32px',
      // Stretch the image to fit the width and height. Use `imageCols` to
      //   account for sprites with multiple frames of animation. Assume a
      //   default of 1 if no imageCols was found.
      // All of my sprites are 32px tall regardless of how many frames they
      //   have, so the height is always 100%. I gave it the "cover" property
      //   so it will stretch instead of repeat.
      backgroundSize: `${100 * (this.props.imageCols || 1)}% ${100}%, cover`
    }
  }

  render () {
    // Not a lot going on here... rock bottom!!
    return (
      <div className={`actor ${this.props.className}`} style={this.getStyle()}>
      </div>
    );
  }
}

export default Actor;
