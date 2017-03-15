import * as axios from "axios";
import { Everything } from "../interfaces";
import { CeleryNode as Step, LATEST_VERSION } from "farmbot";
import {
  SequenceOptions,
  Sequence,
  ChanParams,
  MessageParams,
  EditCurrentSequence,
  PushStep,
  SpliceStepPayl,
  MoveStepPayl,
  ChangeStep,
  ChangeStepSelect,
  RemoveStep,
  SelectSequence,
  SequenceApiResponse
} from "./interfaces";
import { success, error, DropDownItem } from "../ui";
import { prettyPrintApiErrors, AxiosErrorResponse } from "../util";
import { ReduxAction, Thunk } from "../redux/interfaces";
import * as i18next from "i18next";
import { API } from "../api";

export function addChan({ channel_name, index }: ChanParams) {
  return {
    type: "ADD_CHANNEL",
    payload: { channel_name, index }
  };
}

export function removeChan({ channel_name, index }: ChanParams) {
  return {
    type: "REMOVE_CHANNEL",
    payload: { channel_name, index }
  };
}

export function updateMessageType({ value, index }: MessageParams) {
  return {
    type: "UPDATE_MESSAGE_TYPE",
    payload: { value, index }
  };
}

export function nullSequence(): Sequence {
  return {
    color: "gray",
    name: "New Sequence",
    kind: "sequence",
    args: {
      version: LATEST_VERSION
    },
    body: [],
    dirty: false
  };
}

export function copySequence(payload: Sequence) {
  return {
    type: "COPY_SEQUENCE",
    payload
  };
}

export function editCurrentSequence(updates: SequenceOptions):
  ReduxAction<EditCurrentSequence> {
  return {
    type: "EDIT_CURRENT_SEQUENCE",
    payload: updates
  };
}

export function pushStep(step: Step): PushStep {
  return {
    type: "PUSH_STEP",
    payload: { step }
  };
}

export function spliceStep(step: Step, insertBefore: number):
  ReduxAction<SpliceStepPayl> {
  return {
    type: "SPLICE_STEP",
    payload: { step, insertBefore }
  };
}

export function moveStep(step: Step,
  from: number,
  to: number):
  ReduxAction<MoveStepPayl> {
  return {
    type: "MOVE_STEP",
    payload: { step, from, to }
  };
}

export function changeStep(index: number, step: Step): ChangeStep {
  return {
    type: "CHANGE_STEP",
    payload: { step, index }
  };
}

export function changeStepSelect(
  value: string | number,
  index: number,
  field: string): ChangeStepSelect {
  return {
    type: "CHANGE_STEP_SELECT",
    payload: { value, index, field }
  };
}

export function changeMoveAbsStepSelect(
  index: number,
  tool: DropDownItem,
  step: Step) {
  return {
    type: "CHANGE_MOVE_ABS_STEP_SELECT",
    payload: { index, tool, step }
  };
}

// Would be nice to factor this down to fit with CHANGE_STEP
export function changeMoveAbsStepValue(value: string,
  kind: string,
  index: number) {
  return {
    type: "CHANGE_MOVE_ABS_STEP_VALUE",
    payload: { value, kind, index }
  };
}

export function updateSubSequence(
  value: string | number,
  index: number,
  field: string, type: string): ChangeStepSelect {
  return {
    type: "UPDATE_SUB_SEQUENCE",
    payload: { value, index, field, type }
  };
}

export function removeStep(index: number): RemoveStep {
  return {
    type: "REMOVE_STEP",
    payload: { index }
  };
}

export function saveSequence(sequence: Sequence, notify = true): Thunk {
  return function (dispatch) {
    let url = API.current.sequencesPath;
    let p: Axios.IPromise<Axios.AxiosXHR<Sequence>>;
    if (sequence.id) {
      url += sequence.id;
      p = axios.put<Sequence>(url, sequence);
    } else {
      p = axios.post<Sequence>(url, sequence);
    };
    return p.then(function (resp) {
      if (notify) {
        success(i18next.t("Saved '{{SequenceName}}'",
          { SequenceName: (sequence.name || "sequence") }));
      }
      dispatch(saveSequenceOk(resp.data));
      return resp.data;
    })
      .catch(function (err: {}) {
        let template = "Unable to save '{{SequenceName}}'";
        let context = { SequenceName: (sequence.name || "sequence") };
        error(prettyPrintApiErrors(err),
          i18next.t(template, context));
        dispatch(saveSequenceNo(err));
        return Promise.reject(err);
      });
  };
};

export function saveSequenceOk(sequence: Sequence) {
  return {
    type: "SAVE_SEQUENCE_OK",
    payload: sequence
  };
}

export function saveSequenceNo(error: AxiosErrorResponse) {
  prettyPrintApiErrors(error);
  return {
    type: "SAVE_SEQUENCE_NO",
    payload: error
  };
}

export function selectSequence(index: number): SelectSequence {
  return {
    type: "SELECT_SEQUENCE",
    payload: index
  };
}

export function addSequence() {
  return {
    type: "ADD_SEQUENCE",
    payload: {}
  };
}

export function addComment(step: Step, index: number, comment: string) {
  return {
    type: "ADD_COMMENT",
    payload: { comment, index }
  };
}

export function deleteSequence(index: number) {
  // use cases:
  // unsaved sequence. (in state)
  // saved sequence  (http DELETE)
  // misc errors
  // dependency error.

  return function (dispatch: Function, getState: Function) {
    let state: Everything = getState();

    let sequence: Sequence = state.sequences.all[index];

    if (!confirm(`Delete sequence '${sequence.name}'?`)) {
      return;
    }

    function deleteSequenceOK() {
      dispatch({
        type: "DELETE_SEQUENCE_OK",
        payload: sequence
      });
    }

    function deleteSequenceErr(response:
      Axios.AxiosXHR<SequenceApiResponse>) {
      if (response && response.data) {
        error((response.data.sequence) ||
          i18next.t("Unable to delete sequence"));
      }
    }

    if (sequence && sequence.id) {
      let url = API.current.sequencesPath + sequence.id;
      axios.delete(url)
        .then(() => deleteSequenceOK())
        .catch((error) => deleteSequenceErr(error.response));
    } else {
      deleteSequenceOK();
    }
  };
}
