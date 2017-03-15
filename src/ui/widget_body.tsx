import * as React from "react";

interface WidgetBodyProps {
  children?: JSX.Element | undefined;
  className?: string;
}

export function WidgetBody(props: WidgetBodyProps) {
  return <div className="widget-body">
    {props.children}
  </div>;
}
