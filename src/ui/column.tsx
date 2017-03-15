import * as React from "react";
import { parseClassNames } from "./util";

interface ColumnProps {
  children?: JSX.Element | undefined;
  /** {xs-col-size} */
  xs?: number;
  /** {sm-col-size} */
  sm?: number;
  /** {md-col-size} */
  md?: number;
  /** {lg-col-size} */
  lg?: number;
  /** {xs-col-size-offset} */
  xsOffset?: number;
  /** {sm-col-size-offset} */
  smOffset?: number;
  /** {md-col-size-offset} */
  mdOffset?: number;
  /** {lg-col-size-offset} */
  lgOffset?: number;
}

export function Col(props: ColumnProps) {
  let classNames = parseClassNames(props, "");
  return <div className={classNames}>
    {props.children}
  </div>;
}
