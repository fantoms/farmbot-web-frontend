import * as React from "react";
import { DirectionButton } from "./direction_button";
import { homeAll } from "../devices/actions";
import { JogMovementControlsProps } from "./interfaces";

export class JogButtons extends React.Component<JogMovementControlsProps, {}> {
  render() {
    return <table className="jog-table" style={{ border: 0 }}>
      <tbody>
        <tr>
          <td />
          <td />
          <td />
          <td>
            <DirectionButton axis="y"
              direction="up"
              steps={this.props.bot.stepSize || 1000} />
          </td>
          <td />
          <td />
          <td>
            <DirectionButton axis="z"
              direction="up"
              steps={this.props.bot.stepSize || 1000} />
          </td>
        </tr>
        <tr>
          <td>
            <button
              className="button-like i fa fa-home arrow-button"
              onClick={() => homeAll(100)} />
          </td>
          <td />
          <td>
            <DirectionButton axis="x"
              direction="left"
              steps={this.props.bot.stepSize || 1000} />
          </td>
          <td>
            <DirectionButton axis="y"
              direction="down"
              steps={this.props.bot.stepSize || 1000} />
          </td>
          <td>
            <DirectionButton axis="x"
              direction="right"
              steps={this.props.bot.stepSize || 1000} />
          </td>
          <td />
          <td>
            <DirectionButton axis="z"
              direction="down"
              steps={this.props.bot.stepSize || 1000} />
          </td>
        </tr>
        <tr>
          <td />
        </tr>
      </tbody>
    </table>;
  }
}
