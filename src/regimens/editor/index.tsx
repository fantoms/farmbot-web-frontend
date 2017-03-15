import * as React from "react";
import { SaveButton } from "./save_button";
import { DeleteButton } from "./delete_button";
import { CopyButton } from "./copy_button";
import { EmptyEditor } from "./empty_editor";
import { ActiveEditor } from "./active_editor";
import { RegimenEditorWidgetProps } from "./interfaces";
import { Widget, WidgetHeader, WidgetBody } from "../../ui/index";

export function RegimenEditorWidget({ regimens, dispatch, auth }:
  RegimenEditorWidgetProps) {
  if (auth) {
    let regimen = regimens.all[regimens.current];
    let DynamicComponent = regimen ? ActiveEditor : EmptyEditor;
    let saveButtenProps = {
      dispatch,
      regimen,
      token: auth.token,
      baseUrl: (auth.token && auth.token.unencoded.iss) ||
      "CANT_FETCH_TOKEN_ISS"
    };

    return <Widget className="regimen-editor-widget">
      <WidgetHeader title="Regimen Editor"
        helpText={`Regimens allow FarmBot
                to take care of a plant throughout its entire life. A
                regimen consists of many sequences that are scheduled to run
                based on the age of the plant. Regimens are applied to
                plants from the farm designer (coming soon) and can be
                re-used on many plants growing at the same or different
                times. Multiple regimens can be applied to any one plant.`}>
        <SaveButton regimen={regimen}
          dispatch={dispatch}
          url={auth.token.unencoded.iss} />
        <CopyButton regimen={regimen} dispatch={dispatch} />
        <DeleteButton {...saveButtenProps} />
      </WidgetHeader>
      <WidgetBody>
        <DynamicComponent regimen={regimen} dispatch={dispatch} />
      </WidgetBody>
    </Widget>;
  } else {
    throw new Error("Must log in first");
  }
}
