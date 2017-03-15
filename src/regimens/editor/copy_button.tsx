import * as React from "react";
import { copyRegimen } from "../actions";
import { CopyButtnProps } from "./interfaces";
import { t } from "i18next";

export function CopyButton({ dispatch, regimen }: CopyButtnProps) {
  if (regimen) {
    return <button className="yellow button-like"
      onClick={() => dispatch(copyRegimen(regimen))}>
      {t("Copy")}
    </button>;
  } else {
    return <span />;
  };
}
