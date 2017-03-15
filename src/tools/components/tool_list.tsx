import * as React from "react";
import { Row, Col, Widget, WidgetBody, WidgetHeader } from "../../ui";
import { toggleEditingTools } from "../actions";
import { t } from "i18next";
import { Props, Tool } from "../interfaces";

export class ToolList extends React.Component<Props, {}> {
  render() {
    let toggle = () => { this.props.dispatch(toggleEditingTools()); };
    return <Widget>
      <WidgetHeader
        helpText={t(`This is a list of all your FarmBot Tools.
          Click the Edit button to add, edit, or delete tools.`)}
        title="Tools">
        <button
          className="gray button-like"
          onClick={toggle}>
          {t("Edit")}
        </button>
      </WidgetHeader>
      <WidgetBody>
        <Row>
          <Col xs={8}>
            <label>{t("Tool Name")}</label>
          </Col>
          <Col xs={4}>
            <label>{t("Status")}</label>
          </Col>
        </Row>
        {this.props.getSortedTools().map((tool: Tool) => {
          return <Row key={tool.id}>
            <Col xs={8}>{tool.name || "Name not found"}</Col>
            <Col xs={4}>{tool.status || "Status not found"}</Col>
          </Row>;
        })}
      </WidgetBody>
    </Widget>;
  }
};
