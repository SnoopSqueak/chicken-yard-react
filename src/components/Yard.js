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
        pose: "stand",
        direction: 0,
        timeUntilChange: Math.random() * 5000,
        speed: 4,
        isMounted: false,
        facing: Math.random() > .5 ? 1 : -1
      };
      chickens.push(chicken);
    }

    this.state = {
      bushes: bushes,
      chickens: chickens
    };

    this.msPerTick = this.props.msPerTick;
    this.offsetLeft = 0;
    this.offsetTop = 0;
  }

  componentDidMount () {
    this.interval = setInterval(() => this.tick(this.msPerTick), this.msPerTick);
    this.ref = React.createRef();
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  tick (elapsedTime) {
    let chickens = this.state.chickens.map(chicken => {
      let clone = {};
      Object.assign(clone, chicken);
      clone.timeUntilChange -= elapsedTime;
      if (clone.timeUntilChange <= 0) {
        clone.timeUntilChange = Math.random() * 5000;
        switch (clone.pose) {
          case "stand":
            clone.pose = "walk";
            clone.direction = Math.random() * Math.PI * 2;
            clone.speed = (Math.random() * 9) + 1;
            break;
          case "walk":
            clone.pose = "stand";
            clone.frame = 0;
            break;
        }
      }
      if (clone.pose == "walk") {
        let xAmount = Math.cos(clone.direction) * clone.speed;
        let yAmount = Math.sin(clone.direction) * clone.speed;
        if (clone.x + xAmount < 32 || clone.x + xAmount > this.props.width - 64) {
          //clone.direction = Math.atan(yAmount / -xAmount);
          clone.direction = Math.atan2(yAmount, -xAmount);
          xAmount = Math.cos(clone.direction) * clone.speed;
        }
        if (clone.y + yAmount < 32 || clone.y + yAmount > this.props.height - 64) {
          //clone.direction = Math.atan(-yAmount / xAmount);
          clone.direction = Math.atan2(-yAmount, xAmount);
          yAmount = Math.sin(clone.direction) * clone.speed;
        }
        if (xAmount > 0) {
          clone.facing = -1;
        } else {
          clone.facing = 1;
        }
        clone.x += xAmount;
        clone.y += yAmount;
        clone.frame = clone.frame + 1;
        if (clone.frame > 3) {
          clone.frame = 0;
        }
      }
      return clone;
    });
    this.setState({chickens: chickens});
    if (this.props.msPerTick != this.msPerTick) {
      clearInterval(this.interval);
      this.msPerTick = this.props.msPerTick;
      this.interval = setInterval(() => this.tick(this.msPerTick), this.msPerTick);
    }
    if (this.element) {
      this.offsetLeft = this.element.offsetLeft;
      this.offsetTop = this.element.offsetTop;
      this.setState({isMounted: true});
    }
  }

  getStyle() {
    return {
      alignSelf: "center",
      width: this.props.width,
      height: this.props.height,
      backgroundColor: "lightgreen",
      backgroundSize: "cover",
      padding: 0,
      margin: 0
    }
  }

  render() {
    if (!this.state.isMounted) return (<div className="yard" ref={obj => this.element = obj}>Loading...</div>);
    //console.log(this.ref);
    return (
      <div className="yard" style={this.getStyle()} ref={obj => this.element = obj}>
        {
          this.state.bushes.map((bush, index) => {
            return (
              <Bush x={bush.x + this.offsetLeft} y={bush.y + this.offsetTop} key={index} />
            )
          })
        }
        {
          this.state.chickens.map((chicken, index) => {
            return (
              <Chicken
                x={chicken.x + this.offsetLeft}
                y={chicken.y + this.offsetTop}
                frame={chicken.frame}
                pose={chicken.pose}
                facing={chicken.facing}
                key={index}
              />
            )
          })
        }
      </div>
    );
  }
}

export default Yard;
