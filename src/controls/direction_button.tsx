import * as React from "react";
import { moveRelative } from "../devices/actions";
import { DirectionButtonProps } from "./interfaces";
import { Farmbot } from "farmbot";

export class DirectionButton extends React.Component<DirectionButtonProps, {}> {
  sendCommand = () => {
    let isNegative = (this.props.direction === "up") ||
      (this.props.direction === "right");
    let multiplier = (isNegative) ? -1 : 1;
    let distance = (this.props.steps || 250) * multiplier;
    let payload = { speed: Farmbot.defaults.speed, x: 0, y: 0, z: 0 };
    (payload as any)[this.props.axis] = distance;
    moveRelative(payload);
  }

  render() {
    let classes = `button-like fa fa-2x arrow-button radius 
    fa-arrow-${this.props.direction}`;
    return <button onClick={this.sendCommand} className={classes}>
    </button>;
  }
}
