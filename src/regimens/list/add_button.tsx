import * as React from "react";
import { newRegimen } from "../actions";
import { t } from "i18next";
import { AddRegimenProps } from "../interfaces";

export function AddRegimen(props: AddRegimenProps) {
  props.className ? props.className : "";
  let classes = "green button-like " + props.className;
  return <button className={classes}
    onClick={add(props.dispatch)}>
    {props.children || t("Add")}
  </button>;
}

function add(dispatch: Function) {
  return (event: React.FormEvent<{}>) => dispatch(newRegimen());
}
