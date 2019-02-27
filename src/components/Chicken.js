import React, { Component } from 'react';
import Actor from './Actor';
class Chicken extends Component {
  constructor (props) {
    super(props);
    this.timeUntilChange = Math.random() * 5000;
  }

  tick (elapsedTime) {
    this.timeUntilChange -= elapsedTime;
    if (this.timeUntilChange <= 0) {
      this.timeUntilChange = Math.random() * 5000;
      switch (this.actor.state.pose) {
        case "stand":
        default:
          this.actor.setState({
            pose: "walk",
            direction: Math.random() * Math.PI * 2,
            speed: (Math.random() * 9) + 1
          });
          break;
        case "walk":
          this.actor.setState({pose: "stand", frame: 0});
          break;
      }
    }
    if (this.actor.state.pose === "walk") {
      this.props.move(this.actor);
      let frame = this.actor.state.frame + 1;
      if (frame > 3) {
        frame = 0;
      }
      this.actor.setState({frame});
    }
  }

  registerActor (actor) {
    this.props.registerActor(actor);
    this.actor = actor;
  }

  render () {
    return (
      <Actor
        className="chicken"
        imageName="cluck"
        x={this.props.x}
        y={this.props.y}
        left={this.props.left}
        top={this.props.top}
        imageCols="5"
        msPerTick={this.props.msPerTick}
        pose="stand"
        tick={this.tick.bind(this)}
        registerActor={this.registerActor.bind(this)}
      />
    );
  }
}

export default Chicken;
