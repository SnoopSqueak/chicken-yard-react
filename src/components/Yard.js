import React, { Component } from 'react';
import Chicken from './Chicken';
import Bush from './Bush';

class Yard extends Component {
  constructor(props) {
    super(props);

    let bushes = [];
    let chickens = [];
    let i;

    for (i = 0; i < this.props.width; i += 32) {
      bushes.push({x: i, y: 0});
      bushes.push({x: i, y: this.props.height - 32});
    }
    for (i = 32; i < this.props.height - 32; i += 32) {
      bushes.push({x: 0, y: i});
      bushes.push({x: this.props.width - 32, y: i});
    }

    for (i = 0; i < this.props.numChickens; i++) {
      let chicken = {
        x: 32 + Math.floor(Math.random() * (this.props.width - 96)),
        y: 32 + Math.floor(Math.random() * (this.props.height - 96)),
        frame: 0,
        pose: "walk"
      };
      chickens.push(chicken);
    }

    this.state = {
      bushes: bushes,
      chickens: chickens
    };
  }

  componentDidMount () {
    this.interval = setInterval(this.tick.bind(this), this.props.msPerTick);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  tick () {
    let chickens = this.state.chickens.map(chicken => {
      let clone = {};
      Object.assign(clone, chicken);
      clone.frame = clone.frame + 1;
      if (clone.frame > 3) {
        clone.frame = 0;
      }
      return clone;
    });
    this.setState({chickens: chickens});
  }

  getStyle() {
    return {
      width: this.props.width,
      height: this.props.height,
      backgroundColor: "lightgreen"
    }
  }

  render() {
    return (
      <div className="yard" style={this.getStyle()}>
        {
          this.state.bushes.map((bush, index) => {
            return (
              <Bush x={bush.x} y={bush.y} key={index} />
            )
          })
        }
        {
          this.state.chickens.map((chicken, index) => {
            return (
              <Chicken x={chicken.x} y={chicken.y} frame={chicken.frame} pose={chicken.pose} key={index} />
            )
          })
        }
      </div>
    );
  }
}

export default Yard;
