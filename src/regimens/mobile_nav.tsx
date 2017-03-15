import * as React from "react";
import * as _ from "lodash";
import { RegimenPropsWithParams } from "./interfaces";

export function MobileRegimensNav(props: RegimenPropsWithParams) {
  return <div className="mobile-only regimens-mobile-nav col-md-3 col-sm-12">
    <div className="widget-wrapper">
      <div className="widget-header">
        <a href="javascript:history.back()" className="back-arrow">
          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;
          {_.capitalize(props.params.regimen.toString()) || "Name not found"}
        </a>
      </div>
    </div>
  </div>;
}
