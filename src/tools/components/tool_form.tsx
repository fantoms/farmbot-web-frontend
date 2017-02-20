import * as React from "react";
import { ListAndFormProps, ToolFormState } from "../interfaces";
import {
  destroyTool,
  addTool,
  stopEditingTools,
  updateTool,
  saveTools
} from "../actions";
import { t } from "i18next";
import {
  Col,
  Widget,
  WidgetBody,
  WidgetHeader,
  BlurableInput
} from "../../ui";

export class ToolForm extends React.Component<ListAndFormProps, ToolFormState> {
  constructor() {
    super();
    this.add = this.add.bind(this);
    this.set = this.set.bind(this);
    this.save = this.save.bind(this);
    this.updateToolName = this.updateToolName.bind(this);
    this.state = { name: "" };
  }

  add() {
    this.props.dispatch(addTool(this.state.name));
    this.setState({ name: "" });
  }

  updateToolName(e: React.FormEvent<HTMLInputElement>) {
    let { id, value } = e.currentTarget;
    this.props.dispatch(updateTool(parseInt(id), value));
  }

  save() {
    this.props.dispatch(saveTools(this.props.all.tools.all));
  }

  set(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ name: e.currentTarget.value });
  }

  render() {
    let { set, add, updateToolName, save } = this;
    let { dispatch } = this.props;
    let { tools } = this.props.all;
    let stopEdit = () => { dispatch(stopEditingTools()); };
    return <Widget>
      <WidgetHeader
        helpText={t(`This is a list of all your FarmBot Tools.
                      Click the Edit button to add, edit, or delete tools.`)}
        title="TOOLS">
        <button
          className="green button-like"
          onClick={() => { save(); }}>
          {t("SAVE")}
          {tools.dirty && ("*")}
        </button>
        <button
          className="gray button-like"
          onClick={stopEdit}>
          {t("BACK")}
        </button>
      </WidgetHeader>
      <WidgetBody>
        <table>
          <thead>
            <tr>
              <th>{t("TOOL NAME")}</th>
            </tr>
          </thead>
          <tbody>
            {tools.all.map((tool, index) => {
              index++;
              let { name, id } = tool;
              return <tr key={index}>
                <td>
                  <BlurableInput
                    value={name || "Error getting Name"}
                    onCommit={updateToolName}
                    id={(id || (index - 1000)).toString()}
                    name={index.toString()}
                  />
                </td>
                <td>
                  <button
                    className={`button-like red`}
                    onClick={() => {
                      if (id) {
                        dispatch(destroyTool(id));
                      }
                    }}>
                    <i className="fa fa-times"></i>
                  </button>
                </td>
              </tr>;
            })}
            <tr>
              <td>
                <input
                  value={this.state.name}
                  onChange={set}
                  name="name"
                />
              </td>
              <td>
                <button
                  className={`button-like 
                                                green`}
                  onClick={() => { dispatch(add); }}>
                  <i className="fa fa-plus"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </WidgetBody>
    </Widget>;
  }
};
