import React, { Component } from 'react';
import animation from './../animations/chicken';

class Chicken extends Component {
  getFrame () {
    return animation[this.props.pose].frames[this.props.frame];
  }

  getStyle () {
    return {
      background: 'url("/assets/images/cluck.png")',
      backgroundPosition: (-this.props.frame * 100) + "% 0%",
      imageRendering: 'pixelated',
      position: 'absolute',
      //transform: `scaleX(${this.props.facing})`,
      transform: `scaleX(${this.props.facing})`,
      top: this.props.y || 0,
      left: this.props.x || 0,
      width: '32px',
      height: '32px',
      backgroundSize: `500% ${100}%, cover`
    }
  }

  render () {
    return (
      <div className="chicken" style={this.getStyle()}>
      </div>
    );
  }
}

export default Chicken;
