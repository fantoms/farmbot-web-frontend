import * as React from "react";
import { StepParams } from "./index";
import { StepTitleBar } from "./step_title_bar";
import { Help } from "../../ui";
import { copy, remove } from "./index";
import { t } from "i18next";

export function TileExecuteScript({ dispatch, step, index }: StepParams) {
  if (step.kind === "execute_script") {
    return (<div>
      <div className="step-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="step-header send-message-step">
              <StepTitleBar index={index}
                dispatch={dispatch}
                step={step} />
              <i className="fa fa-arrows-v step-control" />
              <i className="fa fa-clone step-control"
                onClick={() => copy({ dispatch, step })} />
              <i className="fa fa-trash step-control"
                onClick={() => remove({ dispatch, index })} />
              <Help text={(`The 'Run Farmware' block runs a
                                FarmWare package. The weed detection script is
                                the only script supported at the moment, but user
                                definable script support is coming soon!`)} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="step-content wait-step">
              <div className="row">
                <div className="col-xs-6 col-md-8">
                  <label>{t("Package Name")}</label>
                  <input type="text" value={step.args.label} disabled={true} />
                  <small>NOTE: Support for customizable scripts is coming soon.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  } else {
    return <p> ERROR </p>;
  }
}
