import * as React from "react";
import { RegimenItemList } from "./regimen_item_list";
import { RegimenNameInput } from "./regimen_name_input";
import { ActiveEditorProps } from "./interfaces";

/** The bottom half of the regimen editor panel (when there's something to
    actually edit). */
export function ActiveEditor({ regimen, dispatch }: ActiveEditorProps) {
  return <div>
    <RegimenNameInput regimen={regimen} dispatch={dispatch} />
    <RegimenItemList items={regimen.regimen_items}
      dispatch={dispatch} />
  </div>;
}
