import * as React from "react";
import { McuInputBoxProps } from "../interfaces";
import { safeStringFetch } from "../../util";
import { McuParams } from "farmbot";
import { changeSettingsBuffer } from "../actions";

export class McuInputBox extends React.Component<McuInputBoxProps, {}> {
  primary() {
    let { bot, setting } = this.props;
    return safeStringFetch(bot.settingsBuffer, setting);
  }

  secondary() {
    let { setting, bot } = this.props;
    return safeStringFetch(bot.hardware.mcu_params, setting);
  }

  style() {
    return {
      border: (this.primary()) ? "1px solid red" : ""
    };
  }

  change(key: string, dispatch: Function) {
    return function (event: React.FormEvent<HTMLInputElement>) {
      let formInput = event.currentTarget.value;
      dispatch(changeSettingsBuffer(key as keyof McuParams, formInput));
    };
  }

  render() {
    return <td>
      <input type="text"
        style={this.style()}
        onChange={this.change(this.props.setting, this.props.dispatch)}
        value={this.primary() || this.secondary() || "---"} />
    </td>;
  }
}
