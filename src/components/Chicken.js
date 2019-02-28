// HEY! Make sure to check out the README if you'd like to know what order
//   I recommend checking out each component. Of course, it's just a suggestion.
//   Do what you want and have fun learning React! :-)

import React, { Component } from 'react';
// The Actor takes care of the basic setup for positioning and animation.
// React does not encourage using inheritance -- for example, I'm not using
//   `class Chicken extends Actor`. Rather, both Actor and Chicken are
//   Components, and to get Chicken to "extend" Actor, I have the Chicken
//   component render an Actor component.
import Actor from './Actor';
class Chicken extends Component {
  constructor (props) {
    super(props);
    // Each chicken will either start or stop wandering after 0-5 seconds.
    // This value is not stored on the state, partly because I don't want to
    //   make a `setState` call when I adjust the value every tick. See `tick`.
    this.timeUntilChange = Math.random() * 5000;
  }

  // This function runs every so often. The interval is up to the user, with
  //   an initial value defined all the way back in the App component.
  // `elapsedTime` represents approximately how much time it has been since the
  //   previous tick. I say "approximately" because I'm using `msPerTick` rather
  //   than actually measuring the time. I could measure the time by declaring
  //   a Date object each tick and subtracting the previous Date object from it
  //   to get something closer to the actual elapsed time, but I don't think
  //   that kind of precision is necessary for this project, and it could
  //   negatively impact performance.
  tick (elapsedTime) {
    // `timeUntilChange` is like a countdown until something happens.
    this.timeUntilChange -= elapsedTime;
    // If `timeUntilChange` has hit 0, do something!
    if (this.timeUntilChange <= 0) {
      // First, randomize the time until the next change:
      this.timeUntilChange = Math.random() * 5000;
      // Then, well... it depends on what we're already doing.
      switch (this.actor.state.pose) {
        // If the chicken is standing, or has some other unhandled pose...
        case "stand":
        default:
          // ...tell the chicken to start walking in a random direction at
          //   a random speed.
          this.actor.setState({
            // I don't think I need `pose` to be on the Actor's state. It's a
            //   holdover from the old animation system. Originally I was going
            //   to have a config file where you could specify different poses,
            //   their frames, and the amount of time between each frame, but
            //   it ended up being unnecessary when I decided on a global speed
            //   for updates, the `msPerTick` prop.
            // I could move it off of the state by setting `this.pose` in Actor,
            //   but that would require rewriting parts of this Chicken function,
            //   and I told myself not to make any more changes to the project or
            //   I'll be working on it forever.
            pose: "walk",
            // Radians tend to be easier to work with than degrees. 2 * PI is
            //   the same as 360 degrees, but I can use the built-in trig
            //   functions like `cos`, `sin`, and `atan2` with radians.
            direction: Math.random() * Math.PI * 2,
            // Speed measures the amount of pixels to move per tick.
            // The chickens and bushes are only 32x32 pixels. If the chicken
            //   happens to roll 8 speed, it's moving a quarter of its width
            //   each tick.
            speed: (Math.random() * 9) + 1
          });
          // `break` can be used within loops, switch statements, and other
          //   places to say, "Hey JavaScript, skip the rest of this part."
          // If we didn't have `break`, it would continue to check the next
          //   case even if it already found something to do. Sometimes that's
          //   desirable, but here it would be a waste of effort.
          break;
        case "walk":
          // If the chicken was walking, time to make them stand.
          this.actor.setState({pose: "stand", frame: 0});
          // This break isn't really preventing anything, but at least I won't
          //   forget it if I later add more cases to this switch statement.
          break;
      }
    }
    // This next part happens EVERY tick, even if `timeUntilChange` did not
    //   reach 0 this time. We want the chickens to walk continuously if they
    //   are in a walking pose.
    if (this.actor.state.pose === "walk") {
      // It uses the `move` function passed into its props. See Yard for more.
      this.props.move(this.actor);
      // Increase the frame by 1 to animate the chicken.
      let frame = this.actor.state.frame + 1;
      // If we went past the end of the walk cycle, reset to the first frame.
      if (frame > 3) {
        frame = 0;
      }
      // Set the actor's state to reflect the new frame.
      this.actor.setState({frame});
    }
    // There is an unused frame of chicken animation, as well as an unused
    //   egg sprite. Originally I was going to have the chickens lay eggs to
    //   hatch other chickens, but I didn't want to spend too many days on
    //   this project. Maybe another time... or maybe you can fork it and give
    //   it a shot!
  }

  // This is an unfortunately confusing part of the design I ended up with.
  // The Yard component has a `registerActor` function that it uses to store
  //   actors in an array. Actors in this array are updated when the window is
  //   resized, so it's important that all actors in the Yard are added to this
  //   array. However, the Chicken component also wants to track the actor, so
  //   the Chicken has it's own `registerActor`. Instead of simply passing
  //   `this.props.registerActor` down to its Actor in the Chicken's `render`
  //   function, I'm passing a reference to the Chicken's `registerActor`,
  //   which then calls `this.props.registerActor`. It's fairly confusing.
  // For contrast, check out the Bush component later.
  registerActor (actor) {
    this.props.registerActor(actor);
    this.actor = actor;
  }

  render () {
    return (
      // The Actor needs a lot of props to function! I might look for a way
      //   to combine some of these properties into single objects in the
      //   future, this is a lot to include on every moving Actor.
      <Actor
        className="chicken"
        // This `imageName` will be used to figure out which image to load. The
        //   Actor component assumes all images will be in public/assets/images.
        imageName="cluck"
        x={this.props.x}
        y={this.props.y}
        left={this.props.left}
        top={this.props.top}
        // `imageCols` specifies how many columns there are in the sprite sheet.
        //   The chicken has five frames of animation all in one row, so we
        //   set it to 5 here. This value is used by Actor to determine which
        //   part of the sprite to show. If it doesn't match the actual number
        //   of frames, or if the image's width is not a multiple of 32, it will
        //   cause interesting graphical glitches.
        // I thought about adding an `imageRows` as well to support
        //   multidimensional sprite sheets, but I didn't feel like doing the
        //   math yet, since none of the images in this project require it.
        imageCols="5"
        msPerTick={this.props.msPerTick}
        // Again, I'm pretty sure `pose` is no longer necessary.
        pose="stand"
        tick={this.tick.bind(this)}
        registerActor={this.registerActor.bind(this)}
      />
    );
  }
}

export default Chicken;
