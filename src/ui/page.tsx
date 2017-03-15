import * as React from "react";

interface PageProps {
  children?: JSX.Element | undefined;
  className?: string;
}

export function Page(props: PageProps) {
  let finalClassName = "all-content-wrapper";
  if (props.className) { finalClassName += ` ${props.className}`; }
  return <div className={finalClassName}>
    {props.children}
  </div>;
}
