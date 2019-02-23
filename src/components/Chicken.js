import React, { Component } from 'react';
import animation from './../animations/chicken';

class Chicken extends Component {
  constructor (props) {
    super(props);
  }

  getFrame () {
    return animation[this.props.pose].frames[this.props.frame];
  }

  getStyle () {
    return {
      backgroundImage: `url("/assets/images/cluck_${this.getFrame()}.png")`,
      imageRendering: 'pixelated',
      backgroundSize: '32px 32px, cover',
      position: 'absolute',
      top: this.props.y || 0,
      left: this.props.x || 0,
      width: '32px',
      height: '32px'
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
