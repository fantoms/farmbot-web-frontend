import * as React from "react";
import { Widget, WidgetHeader, WidgetBody } from "./index";

interface NoContentProps {
  name: string;
  cb: () => void;
}

export function NoContent(props: NoContentProps) {
  return <Widget>
    <WidgetHeader title={props.name} />
    <WidgetBody>
      You don't have any {props.name}s yet!<br />
      Let's add one:
      <button onClick={props.cb} className="green">
        <i className="fa fa-plus" />
      </button>
    </WidgetBody>
  </Widget>;
}
