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
