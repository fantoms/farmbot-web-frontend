import * as React from "react";
// import { parseClassNames } from "./util";

interface WidgetProps {
  children?: JSX.Element | undefined;
  className?: string;
}

export function Widget(props: WidgetProps) {
  let finalClass = `widget-wrapper `;
  if (props.className) { finalClass += props.className; }
  return <div className={finalClass}>
    {props.children}
  </div>;
}
