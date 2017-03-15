import * as React from "react";
import { Peripheral, EditorMode } from "./interfaces";
import { updatePeripheral, destroyPeripheral } from "./actions";
import { t } from "i18next";
import { ToggleButton } from "../toggle_button";
import { pinToggle } from "../../devices/actions";
import { Pin } from "farmbot";
import { BlurableInput } from "../../ui";

interface PeripheralItemProps {
  peripheral: Peripheral;
  /** The physical pin that the peripheral is bound to. */
  pin: Pin;
  /** Determines the state of the editor block. */
  editorMode: EditorMode;
  /** Where to find the device within state.peripheral.all */
  index: number;
  dispatch: Function;
}

export function PeripheralItem(props: PeripheralItemProps) {
  if (props.editorMode === "editing") {
    return <PeripheralItemEdit {...props} />;
  } else {
    return <PeripheralItemControl {...props} />;
  };
};

/** How the bottom half of the peripheral box looks when you are NOT EDITING */
function PeripheralItemControl({ peripheral, pin }: PeripheralItemProps) {
  return <div className="row">
    <div className="col-sm-4">
      <label> {peripheral.label} </label>
    </div>

    <div className="col-sm-4">
      <p>{t("Pin {{num}}", { num: peripheral.pin })}</p>
    </div>

    <div className="col-sm-4">
      <ToggleButton toggleval={pin.value}
        toggleAction={() => pinToggle(peripheral.pin)} />
    </div>
  </div>;
};


/** How the bottom half of the peripheral box looks when you are EDITING */
class PeripheralItemEdit extends React.Component<PeripheralItemProps, {}> {
  commitLabel = (e: React.FormEvent<HTMLInputElement>) => {
    let label = e.currentTarget.value;
    this.props.dispatch(updatePeripheral({
      index: this.props.index,
      peripheral: { label }
    }));
  }

  commitPin = (e: React.FormEvent<HTMLInputElement>) => {
    let pin = parseInt(e.currentTarget.value, 10);
    this.props.dispatch(updatePeripheral({
      index: this.props.index,
      peripheral: { pin }
    }));
  }

  render() {
    let { peripheral, index, dispatch } = this.props;
    return <div className="row">
      <div className="col-sm-4">
        <BlurableInput value={peripheral.label}
          onCommit={this.commitLabel} />
      </div>
      <div className="col-sm-4">
        <BlurableInput type="number"
          value={peripheral.pin.toString()}
          onCommit={this.commitPin} />
      </div>
      <div className="col-sm-4">
        <button className="button-like red"
          onClick={() => dispatch(destroyPeripheral(
            { index, peripheral }
          ))}>
          <i className="fa fa-times" />
        </button>
      </div>
    </div>;
  }
};
