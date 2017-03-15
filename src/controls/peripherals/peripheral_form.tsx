import * as React from "react";
import { PeripheralFormProps } from "./interfaces";
import { pushPeripheral } from "./actions";
import { error } from "../../ui";
import { t } from "i18next";
import * as _ from "lodash";

export function PeripheralForm(props: PeripheralFormProps) {
  let Comp: JSX.Element;

  if (props.editorMode === "editing") {
    Comp = <PeripheralFormEdit {...props} />;
  } else {
    Comp = <div />;
  }
  return Comp;
}

interface PeripheralFormEditState {
  label?: string;
  pin?: number;
}

class PeripheralFormEdit extends React.Component<PeripheralFormProps,
  PeripheralFormEditState> {
  constructor() {
    super();
    this.state = { label: "" };
  }

  resetState() {
    this.setState({ label: "", pin: undefined });
  }

  commitLabel = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ label: e.currentTarget.value });
  }

  commitPin = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      pin: parseInt(e.currentTarget.value, 10)
    });
  }

  submit = () => {
    let { pin, label } = this.state;
    if (label &&
      _.isNumber(pin) &&
      pin &&
      pin > 0) {
      this
        .props
        .dispatch(pushPeripheral({ label, pin }));
      this.resetState();

    } else {
      error(t("Please enter a valid label and pin number."));
    }
  }

  render() {
    return <div className="row">
      <div className="col-sm-4">
        <input type="text"
          placeholder="Label"
          onChange={this.commitLabel}
          value={this.state.label}
        />
      </div>

      <div className="col-sm-4">
        <input type="number"
          value={(this.state.pin || "").toString()}
          placeholder="Pin #"
          onChange={this.commitPin} />
      </div>

      <div className="col-sm-4">
        <button className="button-like green"
          onClick={this.submit}>
          <i className="fa fa-plus" />
        </button>
      </div>
    </div>;
  }
};
