import * as React from "react";
import { t } from "i18next";
import { AddButtonProps } from "./interfaces";

export function AddButton({ active, click }: AddButtonProps) {
  if (!active) { return <div />; }
  return <button className="green button-like" onClick={click}>
    {t("Add")}
  </button>;
}
