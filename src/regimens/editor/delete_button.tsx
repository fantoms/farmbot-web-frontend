import * as React from "react";
import { deleteRegimen } from "../actions";
import { t } from "i18next";
import { DeleteButtonProps } from "./interfaces";

function remove({ regimen, dispatch }: DeleteButtonProps) {
  if (regimen) {
    return (event: React.FormEvent<{}>) =>
      regimen && dispatch(deleteRegimen(regimen));
  } else {
    // Technically unreachable, but I'll keep TS happy...
    throw new Error("Tried to delete non-existant regimen");
  }
}

export function DeleteButton({ regimen, dispatch, baseUrl }: DeleteButtonProps) {
  if (!regimen) { return <span />; };
  return <button className="red button-like"
    onClick={remove({ dispatch, regimen, baseUrl })}>
    {t("Delete")}
  </button>;
}
