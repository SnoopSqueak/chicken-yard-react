// HEY! Make sure to check out the README if you'd like to know what order
//   I recommend checking out each component. Of course, it's just a suggestion.
//   Do what you want and have fun learning React! :-)

import React, { Component } from 'react';
// Notice the Yard does not need to import the Actor component, although both
//   the Bush and the Chicken components use Actor themselves.
import Chicken from './Chicken';
import Bush from './Bush';

class Yard extends Component {
  constructor(props) {
    super(props);

    // This initialize an empty array to hold a bunch of objects representing
    //   bushes. The bushes don't do much besides sit in one place.
    let bushes = [];
    // Since I'm using `i` for two `for` loops, I decided to declare it up
    //   top. There's probably a more elegant way to write this part.
    let i;

    // The first loop goes from left to right, creating a pair of bushes at
    //   the top and bottom of the screen every 32 pixels.
    for (i = 0; i < this.props.width; i += 32) {
      // Each bush object only needs an x and a y value to represent their
      //   position, and their position will likely never change. That's
      //   all they do!
      bushes.push({x: i, y: 0});
      bushes.push({x: i, y: this.props.height - 32});
    }
    // The second loop goes from top to bottom, creating a pair of bushes at
    //   the left and right of the screen every 32 pixels. It doesn't start at
    //   the very top or go to the very bottom; the previous loop already
    //   put some bushes in those places.
    for (i = 32; i < this.props.height - 32; i += 32) {
      bushes.push({x: 0, y: i});
      bushes.push({x: this.props.width - 32, y: i});
    }

    // Now that we have our starting bushes, store it on the state. That way
    //   if we change them later, React will automatically update the DOM.
    this.state = {
      bushes: bushes
    };

    // Conversely, we don't need to automatically update the DOM when these
    //   values change, they're more "behind the scenes." It's better that they
    //   don't have to wait for `setState` to complete, they can change their
    //   values immediately.
    // `msPerTick` stores the number of milliseconds between each "tick". See
    //   App for more details.
    this.msPerTick = this.props.msPerTick;
    // The `actors` array will store all of the Actor components contained
    //   in this yard. That way these actors can be updated when this component
    //   is updated.
    this.actors = [];
  }

  componentDidMount () {
    // Register this component with App's resize listeners; see App for more.
    this.props.registerResize(this);
  }

  // This is probably the most shameful function in the project. I wish it
  //   wasn't necessary, but "listening" to the position and dimensions of
  //   an HTML element proved to be very challenging. I tried a number of
  //   things, including setting up MutationObservers and wrestling with
  //   React references, but this is the best I could come up with for now.
  hotfix () {
    // When `hotfix` is called, call `setRef` to make sure Yard is aware of
    //   the most recent changes. `hotfix` is called a short, arbitrary amount
    //   of time after the window is resized. See App for more.
    this.setRef(this.ref, true);
    // The previous line updates the Yard component; this next part updates
    //   each actor contained by the Yard component to make sure they all
    //   update along with Yard.
    this.actors.forEach(actor => {
      actor.forceUpdate();
    });
  }

  // The `move` function can be passed down to Actors (specifically the Chicken
  //   in this case, see the `render` function). Those Actors can call the
  //   move function to tell Yard that they want to move. It's up to Yard
  //   whether or not they can go the way they wanted, though.
  move (actor) {
    // Get the direction from the actor and store it in a local variable so
    //   I can assign it a value later. We'll send that value back to the actor
    //   with a `setState` call, but we don't do that yet because this might
    //   not be the "final" direction. If the actor bumps into an edge, Yard
    //   will turn them around.
    let direction = actor.state.direction;
    // Get the x and y components of the movement vector. A vector is just a
    //   combination of direction and velocity; in this case, the direction
    //   and velocity (or speed) both come from the actor object.
    // Usually you won't have to do your own math, but it helps to be able to.
    //   This is fairly basic trigonometry, but it's still not entirely
    //   intuitive to me. I always end up doodling circles and triangles in
    //   Paint while Googling similar problems before I'm able to nail
    //   down something that works. I probably could have found a library that's
    //   better suited to this sort of thing. That's true of the whole app really,
    //   but part of the point is to show what you can accomplish with little
    //   more than the built-in features of Node, React, and JavaScript.
    let xAmount = Math.cos(direction) * actor.state.speed;
    let yAmount = Math.sin(direction) * actor.state.speed;
    // This `hitSolid` boolean is a flag will be switched to `true` if a
    //   collision is detected.
    let hitSolid = false;

    // This comment is still in the master branch as well:

    // // // this has them turn around BEFORE hitting the wall. it should
    // // //   really calculate how much farther they would have moved to
    // // //   actually hit the edge, then use their remaining movement to
    // // //   push them away again.
    // // //
    // // // Also it'd be really cool if I add collisions to the bushes rather
    // // //   than the edges. Then I can make random yard layouts, too.

    // Let's see what it's talking about.

    // If the actor's x position would go out of bounds (into the bushes)...
    if (actor.state.x + xAmount < 32 || actor.state.x + xAmount > this.props.width - 64) {
      // ...invert the x component of the direction and recalculate the direction.
      direction = Math.atan2(yAmount, -xAmount);
      // Using the x-mirrored direction, recalculate the xAmount.
      xAmount = Math.cos(direction) * actor.state.speed;
      // Also, we hit something! Raise that flag.
      hitSolid = true;
    }
    // If the actor's y position would go out of bounds (into the bushes)...
    if (actor.state.y + yAmount < 32 || actor.state.y + yAmount > this.props.height - 64) {
      // ...invert the y component of the direction and recalculate the direction.
      direction = Math.atan2(-yAmount, xAmount);
      // Using the y-mirrored direction, recalculate the xAmount.
      yAmount = Math.sin(direction) * actor.state.speed;
      // Also, we hit something! Raise that flag. I'm not sure if it would be
      //   more or less costly to put an `if (!hitSolid)` around this, since it's
      //   possible `hitSolid` was already set to `true` because the x value
      //   was out of bounds. I decided to go with less code, the performance
      //   impact is probably negligible.
      hitSolid = true;
    }
    // Now that we've figured out where the actor is going, let's let them
    //   know by updating their state.
    actor.setState({
      direction: direction,
      facing: xAmount > 0 ? -1 : 1,
      x: actor.state.x + xAmount,
      y: actor.state.y + yAmount
    });
    // Return `true` if they bumped into something or `false` otherwise. This
    //   returned value isn't really used for anything yet.
    return hitSolid;
  }

  // I decided to use a function to generate the style for this component
  //   since it relies on values from the props. I could have put the whole
  //   thing into the `render` function, but I like keeping things separate.
  // ...I later ended up moving it into the `render` function anyway, and
  //   forgot to take it out from here. Whoops!
  getStyle() {
    return {
      alignSelf: "center",
      width: this.props.width,
      height: this.props.height,
      // A nice shade for cartoon grass
      backgroundColor: "lightgreen",
      // Make sure it covers the whole area
      backgroundSize: "cover",
      // No padding, no margins. I didn't want elements within the Yard or the
      //   Yard itself to accidentally push other elements around.
      padding: 0,
      margin: 0,
      // This is only used to center the "Loading..." text when the Yard
      //   hasn't yet found its Ref object.
      lineHeight: this.props.height + "px"
    }
  }

  // This function is used to update the Yard's Ref. React provides Refs as a
  //   way of accessing the HTML element created by this component. See the
  //   `render` function for more information. With that Ref, we can figure out
  //   the Yard's current position.
  // I added a `force` argument so that the `hotfix` function can force a
  //   `setState` call even if the new ref has the same offset values as the
  //   old ref. This whole thing feels a little too hacky for comfort.
  setRef (ref, force=false) {
    if (force || (ref && ref.offsetLeft !== this.state.offsetLeft && ref.offsetTop !== this.state.offsetTop)) {
      this.ref = ref;
      this.setState({offsetLeft: ref.offsetLeft, offsetTop: ref.offsetTop});
    }
  }

  // This function can be passed down to the actors so they can add themselves
  //   to the Yard's list of known actors. When the Yard's `hotfix` function
  //   runs, each actor in the list is also updated.
  registerActor (actor) {
    this.actors.push(actor);
  }

  // To avoid putting ugly logic in the `render` function, I put it in a
  //   separate function. If no `x` and `y` are provided, it shows "Loading..."
  // If `x` and `y` are provided, it renders the bushes and chickens.
  renderChildren (x, y) {
    if (x && y) {
      // I don't know how many elements I'll be rendering, so I declare
      //   an empty array to store an arbitrary number of them.
      let children = [];
      // Another basic `for` loop. They have many uses! This one will run
      //   once for each chicken the Yard is supposed to render. Note that
      //   unlike the bushes, the Yard is not using an array of objects to track
      //   the Chickens. They are simply rendered here as Components, and they
      //   use the functions passed into their props to interact with the Yard.
      for (var i = 0; i < this.props.numChickens; i++) {
        children.push(
          <Chicken
            // Set the Chicken's x and y to random starting values. Make sure
            //   they fit within the boundaries created by the bushes and used
            //   for collision detection.
            x={32 + Math.floor(Math.random() * (this.props.width - 96))}
            y={32 + Math.floor(Math.random() * (this.props.height - 96))}
            // The `left` and `right` properties tell the Actor where the
            //   top-left corner of the Yard is. The Actors are using
            //   absolute positioning to position themselves, so they add
            //   the left and top values to their individual `x` and `y`
            //   values. Every Actor gets the same `left` and `top`, but might
            //   have different `x`es and `y`s.
            left={x}
            top={y}
            // Pass the `move` function so that the Actor can move if it wants
            move={this.move.bind(this)}
            // Pass in `msPerTick` so the Chicken can do its custom behavior
            msPerTick={this.props.msPerTick}
            // Always include a `key` in JSX elements that are created by an
            //   iterator, such as the `for` loop we're in. Otherwise React
            //   will complain in the console. Usually the consequences aren't
            //   much worse than that, though.
            // Here I'm using `children.length`, since it will be increased by
            //   1 after each `push` call and will always be unique.
            key={children.length}
            // Pass the `registerActor` function so that the Actor can register
            //   itself with the Yard and will be updated whenever the Yard's
            //   `hotfix` method is called.
            registerActor={this.registerActor.bind(this)}
          />
        );
      }
      // Now that we're out of the `for` loop and done pushing chickens, let's
      //   start pushing bushes. This time I'm using a `map` call instead of a
      //   `for` loop because the bushes are already stored in an array.
      // The spread operator, `...`, takes every element out of the array
      //   returned by `this.state.bushes.map()` and sends them individually to
      //   the `children.push` call. If I didn't have the spread operator, the
      //   children array would contain a number of Chicken objects,
      //   followed by a single array containing multiple Bush objects.
      // The `map` call runs the callback function for each element in the
      //   `this.state.bushes` array. For each one, it returns a Bush.
      children.push(...this.state.bushes.map((bush, index) => {
        return (
          <Bush
            x={bush.x}
            y={bush.y}
            // Here I'm not just using `children.length` on its own again,
            //   because this time I'm technically only doing one `push` call.
            //   The length won't be updated until after `map` has run its
            //   callback for each element in the bushes array. To compensate
            //   for this, I'm adding the `index` parameter the `map` function
            //   gives us access to. `index` starts at 0 when the `map` callback
            //   is looking at the first element in the array; then it goes to
            //   1, then to 2, etc.
            key={children.length + index}
            left={x}
            top={y}
            registerActor={this.registerActor.bind(this)}
          />
        )
      }));
      // Now that we've created all of our bushes and chickens in the `children`
      //   array, return that array to whoever called `renderChildren`.
      return children;
    } else {
      // If no `x` and `y` were provided, never mind all that stuff about
      //   chickens and bushes. We don't even know where the Yard is yet.
      //   Let's just show "Loading...". Admittedly, it's still not as
      //   seamless as I would prefer.
      return (
        <div>Loading...</div>
      );
    }
  }

  render () {
    return (
      <div
        className="yard"
        // Sorry `getStyle` function, you're no longer needed...
        style={
          {
            alignSelf: "center",
            width: this.props.width,
            height: this.props.height,
            backgroundColor: "lightgreen",
            backgroundSize: "cover",
            padding: 0,
            margin: 0,
            lineHeight: this.props.height + "px"
          }
        }
        // This is one way to get a React Ref. Whenever this div element is
        //   rendered, the `ref` callback will be executed, and an object
        //   representing the div is passed into it. I pass that into `setRef`
        //   and use the ref to update the offsetLeft and offsetTop properties
        //   on the state.
        ref={obj => this.setRef(obj)}
      >
        // `this.state.offsetLeft` should contain either the left position of
        //   the yard div on the screen, or null. If it's null, `renderChildren`
        //   will only show "Loading...". If it's not null, `renderChildren`
        //   will position each Actor's x starting at `this.state.offsetLeft`.
        // Same goes for `this.state.offsetTop` and the y coordinate.
        {this.renderChildren(this.state.offsetLeft, this.state.offsetTop)}
      </div>
    );
  }
}

export default Yard;
