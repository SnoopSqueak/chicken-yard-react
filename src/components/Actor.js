import React, { Component } from 'react';
class Actor extends Component {
  constructor (props) {
    super(props);
    let direction = Math.random() * Math.PI * 2;
    this.state = {
      x: this.props.x || 0,
      y: this.props.y || 0,
      pose: this.props.pose,
      frame: this.props.frame || 0,
      direction: this.props.direction || direction,
      facing: this.props.facing || Math.cos(direction) > 0 ? 1 : -1
    };
    this.msPerTick = this.props.msPerTick;
  }

  componentDidMount () {
    if (this.msPerTick) this.interval = setInterval(() => this.tick(this.props.msPerTick), this.msPerTick);
    this.props.registerActor(this);
  }

  componentWillUnmount () {
    if (this.interval) clearInterval(this.interval);
  }

  tick (elapsedTime) {
    if (this.props.tick) this.props.tick(elapsedTime);
    if (this.props.msPerTick !== this.msPerTick) {
      clearInterval(this.interval);
      this.msPerTick = this.props.msPerTick;
      this.interval = setInterval(() => this.tick(this.msPerTick), this.msPerTick);
    }
  }

  getStyle () {
    return {
      background: `url("/assets/images/${this.props.imageName}.png")`,
      backgroundPosition: (-this.state.frame * 100) + "% 0%",
      imageRendering: 'pixelated',
      position: 'absolute',
      transform: `scaleX(${this.state.facing})`,
      top: (this.props.top || 0) + (this.state.y || 0),
      left: (this.props.left || 0) + (this.state.x || 0),
      width: '32px',
      height: '32px',
      backgroundSize: `${100 * (this.props.imageCols || 1)}% ${100}%, cover`
    }
  }

  render () {
    return (
      <div className={`actor ${this.props.className}`} style={this.getStyle()}>
      </div>
    );
  }
}

export default Actor;
