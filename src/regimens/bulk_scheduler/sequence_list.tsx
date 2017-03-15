import * as React from "react";
import { Sequence } from "../../sequences/interfaces";
import { setSequence } from "./actions";
import { FBSelect, DropDownItem } from "../../ui";
import * as _ from "lodash";
import { t } from "i18next";
import { SequenceListProps } from "./interfaces";

let options: DropDownItem[] = [];
let selectedSequence: DropDownItem;

export function SequenceList({ sequences,
  current,
  dispatch }: SequenceListProps) {

  sequences
    .filter(x => !!x.id) // Don't show unsaved.
    .map((sequence, index) => {
      // Need for initialValue to match DropDownItem interface.
      if (sequence.id === current.id) {
        selectedSequence = { label: sequence.name, value: index };
      }
      let target = { label: sequence.name, value: index.toString() };
      if (!_.some(options, target)) {
        options.push({
          label: sequence.name,
          value: index.toString()
        });
      }
    });

  return <div>
    <label>{t("Sequence")}</label>
    <FBSelect
      allowEmpty={true}
      initialValue={selectedSequence}
      onChange={change(dispatch, sequences)}
      list={options}
      placeholder="Select Sequence" />
  </div>;
}

function change(dispatch: Function, sequences: Sequence[]) {
  // TODO: Solve react-select types issue. Everything breaks.
  return (event: DropDownItem) => {
    let i = _.parseInt((event.value || "-999").toString());
    dispatch(setSequence(sequences[i]));
  };
}
