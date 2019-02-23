import React, { Component } from 'react';

class Bush extends Component {
  getStyle () {
    return {
      backgroundImage: 'url("/assets/images/bush.png")',
      imageRendering: 'pixelated',
      backgroundSize: '32px 32px, cover',
      position: 'absolute',
      top: this.props.y || 0,
      left: this.props.x || 0,
      width: '32px',
      height: '32px'
    }
  }

  render() {
    return (
      <div className="bush" style={this.getStyle()}>
      </div>
    );
  }
}

export default Bush;
