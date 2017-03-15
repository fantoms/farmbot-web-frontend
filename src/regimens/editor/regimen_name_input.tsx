import * as React from "react";
import { editRegimen } from "../actions";
import { RegimenProps, Regimen } from "../interfaces";
import { t } from "i18next";
import { ColorPicker } from "../../sequences/color_picker";
import { Color } from "../../interfaces";
import { Row, Col } from "../../ui/index";

function write({ dispatch, regimen }: RegimenProps):
  React.EventHandler<React.FormEvent<{}>> {
  if (!regimen) {
    throw new Error("Regimen is required");
  }
  return (event: React.FormEvent<HTMLInputElement>) => {
    regimen = regimen as Regimen; // Almost certainly a bug in TS.
    let action = editRegimen(regimen, { name: event.currentTarget.value });
    dispatch(action);
  };
}

function updateColor({ dispatch, regimen }: RegimenProps) {
  if (!regimen) {
    throw new Error("Regimen is required");
  } else {
    return (function colorUpdater(color: Color) {
      dispatch(editRegimen(regimen, { color }));
    });
  }
};

export function RegimenNameInput({ regimen, dispatch }: RegimenProps) {
  let value = (regimen && regimen.name) || "";
  return <Row>
    <Col xs={10}>
      <input id="right-label"
        placeholder={t("Regimen Name")}
        type="text"
        onChange={write({ dispatch, regimen })}
        value={value} />
    </Col>
    <ColorPicker current={(regimen && regimen.color) || "gray"}
      onChange={updateColor({ dispatch, regimen })} />
  </Row>;
}
