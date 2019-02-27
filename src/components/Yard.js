import React, { Component } from 'react';
import Chicken from './Chicken';
import Bush from './Bush';

class Yard extends Component {
  constructor(props) {
    super(props);

    let bushes = [];
    let i;

    for (i = 0; i < this.props.width; i += 32) {
      bushes.push({x: i, y: 0});
      bushes.push({x: i, y: this.props.height - 32});
    }
    for (i = 32; i < this.props.height - 32; i += 32) {
      bushes.push({x: 0, y: i});
      bushes.push({x: this.props.width - 32, y: i});
    }

    this.state = {
      bushes: bushes
    };

    this.msPerTick = this.props.msPerTick;
    this.actors = [];
  }

  componentDidMount () {
    this.props.registerResize(this);
  }

  hotfix () {
    this.setRef(this.ref, true);
    this.actors.forEach(actor => {
      actor.forceUpdate();
    });
  }

  move (actor) {
    let direction = actor.state.direction;
    let xAmount = Math.cos(direction) * actor.state.speed;
    let yAmount = Math.sin(direction) * actor.state.speed;
    let hitSolid = false;
    // this has them turn around BEFORE hitting the wall. it should
    //   really calculate how much farther they would have moved to
    //   actually hit the edge, then use their remaining movement to
    //   push them away again.

    // Also it'd be really cool if I add collisions to the bushes rather
    //   than the edges. Then I can make random yard layouts, too.

    if (actor.state.x + xAmount < 32 || actor.state.x + xAmount > this.props.width - 64) {
      direction = Math.atan2(yAmount, -xAmount);
      xAmount = Math.cos(direction) * actor.state.speed;
      hitSolid = true;
    }
    if (actor.state.y + yAmount < 32 || actor.state.y + yAmount > this.props.height - 64) {
      direction = Math.atan2(-yAmount, xAmount);
      yAmount = Math.sin(direction) * actor.state.speed;
      hitSolid = true;
    }
    actor.setState({
      direction: direction,
      facing: xAmount > 0 ? -1 : 1,
      x: actor.state.x + xAmount,
      y: actor.state.y + yAmount
    });
    return hitSolid;
  }

  getStyle() {
    return {
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

  setRef (ref, force=false) {
    if (force || (ref && ref.offsetLeft !== this.state.offsetLeft && ref.offsetTop !== this.state.offsetTop)) {
      this.ref = ref;
      this.setState({offsetLeft: ref.offsetLeft, offsetTop: ref.offsetTop});
    }
  }

  registerActor (actor) {
    this.actors.push(actor);
  }

  renderChildren (x, y) {
    if (x && y) {
      let children = [];
      for (var i = 0; i < this.props.numChickens; i++) {
        children.push(
          <Chicken
            x={32 + Math.floor(Math.random() * (this.props.width - 96))}
            y={32 + Math.floor(Math.random() * (this.props.height - 96))}
            left={x}
            top={y}
            move={this.move.bind(this)}
            msPerTick={this.props.msPerTick}
            key={children.length}
            registerActor={this.registerActor.bind(this)}
          />
        );
      }
      children.push(...this.state.bushes.map((bush, index) => {
        return (
          <Bush
            x={bush.x}
            y={bush.y}
            key={children.length + index}
            left={x}
            top={y}
            registerActor={this.registerActor.bind(this)}
          />
        )
      }));
      return children;
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }

  render () {
    return (
      <div
        className="yard"
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
        ref={obj => this.setRef(obj)}
      >
        {this.renderChildren(this.state.offsetLeft, this.state.offsetTop)}
      </div>
    );
  }
}

export default Yard;
