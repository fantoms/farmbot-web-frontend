import * as React from "react";
import { t } from "i18next";
import { BetaSelect } from "../ui";

interface FWState {
}

interface FWProps {
}

export class Farmware extends React.Component<FWProps, FWState> {
  render() {
    return <div className="col-sm-12">
      <div className="row">
        <div className="col-sm-12">
          <div className="widget-header">
            <h5>Farmware</h5>
            <i className="fa fa-question-circle widget-help-icon">
              <div className="widget-help-text">
                {t(`This widget shows Farmware (plugin) information.`)}
              </div>
            </i>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="widget-content">
            <div className="row">
              <input type="url" value="-1" />
              <button className="green button-like go">Install Package</button>
              <BetaSelect dropDownItems={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
