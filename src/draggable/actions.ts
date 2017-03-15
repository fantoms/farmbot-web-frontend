import { DataXfer, DataXferIntent, DataXferBase } from "./interfaces";
import { uuid as id } from "farmbot";
import { SequenceBodyItem as Step } from "farmbot";
import { Everything } from "../interfaces";
import { ReduxAction } from "../redux/interfaces";
import * as React from "react";

/** SIDE EFFECT-Y!! Stores a step into state.draggable.dataTransfer and
 * attaches its lookup key to the event object. This allows you to retrieve
 * the step when the "drop" event occurs elsewhere */
export function stepPut(value: Step,
  ev: React.DragEvent<HTMLElement>,
  intent: DataXferIntent,
  draggerId: number):
  ReduxAction<DataXferBase> {
  let uuid = id();
  ev.dataTransfer.setData("text", uuid);
  return {
    type: "PUT_DATA_XFER",
    payload: {
      intent,
      uuid,
      value,
      draggerId
    }
  };
};

/** Used by a React component reacting to a "drop" event. Takes a UUID and looks
 * for a step stored in store.draggable.data_transfer. Removes it from the store
 * and returns it to the component. */
export function stepGet(uuid: string) {
  return function (dispatch: Function,
    getState: () => Everything):
    DataXfer {
    let obj = getState().draggable.dataTransfer[uuid];

    if (obj && obj.intent) {
      dispatch({ type: "DROP_DATA_XFER", payload: uuid });
      return obj;
    } else {
      throw new Error(`Can't find StepXferObject with UUID ${uuid}`);
    }
  };
}
