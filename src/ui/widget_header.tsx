import * as React from "react";
import { t } from "i18next";

interface WidgetHeaderProps {
  children?: JSX.Element | undefined;
  helpText?: string;
  title: string;
}

export function WidgetHeader(props: WidgetHeaderProps) {
  return <div className="widget-header">
    {props.children}
    <div>
      <h5>{t(props.title)}</h5>
      <i className="fa fa-question-circle widget-help-icon">
        <div className="widget-help-text">
          {t(props.helpText || "")}
        </div>
      </i>
    </div>
  </div>;
}
