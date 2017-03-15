import * as React from "react";

interface RowProps {
  children?: JSX.Element | undefined;
  className?: string;
  key?: string | number;
}

export function Row(props: RowProps) {
  let className = props.className ? props.className += " row" : "row";
  return <div className={className} key={props.key || ""}>
    {props.children}
  </div>;
}
