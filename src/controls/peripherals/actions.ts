import { Everything } from "../../interfaces";
import { ReduxAction } from "../../redux/interfaces";
import * as axios from "axios";
import { error } from "../../ui";
import { t } from "i18next";
import { IndexedPeripheral, Peripheral, UpdatePeripheral } from "./interfaces";
import { devices } from "../../device";
import * as _ from "lodash";
import { API } from "../../api";

/** Transitions the peripherals form from a controlling state
 *  into an editing state */
export function startEditing(): ReduxAction<{}> {
  return {
    type: "EDIT_PERIPHERALS_START",
    payload: {}
  };
}

/** Flips the peripheral form out of the editing state. */
export function startControlling(): ReduxAction<{}> {
  return { type: "CONTROL_PERIPHERALS_START", payload: {} };
}

/** Triggered when the user uses the inline form on the peripheral box. */
export function updatePeripheral({ index, peripheral }: UpdatePeripheral):
  ReduxAction<{}> {
  return {
    type: "UPDATE_PERIPHERAL",
    payload: {
      index,
      peripheral
    }
  };
};

export function destroyPeripheral(payload: IndexedPeripheral) {
  return function (dispatch: Function, getState: () => Everything) {
    let id = payload.peripheral.id;
    function remove() {
      dispatch({
        type: "REMOVE_PERIPHERAL",
        payload
      });
    }
    if (id) {
      axios
        .delete(API.current.peripheralsPath + id)
        .then(remove)
        .catch(handleError("Peripheral deletion failed."));
    } else {
      remove();
    };
  };
}

export function saveAll() {
  return function (dispatch: Function, getState: () => Everything) {
    let state = getState();
    axios
      .post<Peripheral[]>(API.current.peripheralsPath,
      { peripherals: state.peripherals.all })
      .then(function (x) {
        devices.current.sync();
        dispatch({
          type: "REPLACE_PERIPHERALS",
          payload: x.data
        });
      })
      .catch(handleError("There was a problem saving peripherals"));
  };
}

function handleError(defaultMsg: string) {
  return function (x: {}) {
    let message = _.get(x, "response.data.error", t(defaultMsg));
    error(message);
  };
}

export function pushPeripheral(payload: Peripheral) {
  return { type: "PUSH_PERIPHERAL", payload };
}
