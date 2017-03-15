import * as React from "react";
import { BotProp } from "../interfaces";
import { t } from "i18next";
import { ToggleButton } from "../../controls/toggle_button";
import { checkArduinoUpdates, updateConfig } from "../actions";

export let FwUpdateButton = ({ bot }: BotProp) => {
  let fwUpdateBool = bot.hardware.configuration.fw_auto_update;
  let buttonStr = "Can't Connect to bot";
  let buttonColor = "yellow";
  if (bot.currentFWVersion != undefined) {
    if (bot.currentFWVersion == (
      bot.hardware.mcu_params.param_version || "").toString()) {
      buttonStr = t("UP TO DATE");
      buttonColor = "gray";
    } else {
      buttonStr = t("UPDATE");
      buttonColor = "green";
    }
  }
  return <div className="updates">
    <p>{t("Auto Updates?")}</p>
    <ToggleButton toggleval=
      {String(fwUpdateBool) || "undefined"}
      toggleAction={() => {
        updateConfig({ fw_auto_update: !fwUpdateBool });
      }} />
    <button className={`button-like ${buttonColor}`}
      onClick={() => checkArduinoUpdates()}>
      {buttonStr}
    </button>
  </div>;
};
