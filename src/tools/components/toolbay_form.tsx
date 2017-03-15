import * as React from "react";
import { ToolSlot, Props } from "../interfaces";
import {
  Widget,
  WidgetBody,
  WidgetHeader,
  FBSelect,
  Col,
  Row,
  BlurableInput,
  DropDownItem
} from "../../ui";
import {
  toggleEditingToolBays,
  addSlot,
  destroySlot,
  updateSlot,
  detachTool,
  saveToolBay
} from "../actions";
import { t } from "i18next";

export class ToolBayForm extends React.Component<Props, Partial<ToolSlot>> {
  constructor() {
    super();
    this.state = { x: 0, y: 0, z: 0 };
  }

  resetDropDownValue = (slot_id: number, fieldName: string, value: number) => {
    this.props.dispatch(updateSlot(slot_id, fieldName, value));
  }

  updateSlot = (slot_id: number, fieldName: string, value: number) => {
    this.props.dispatch(updateSlot(slot_id, fieldName, value));
  }

  detachTool = (slot_id: number) => {
    this.props.dispatch(detachTool(slot_id));
  }

  updateSlotAxis = (ts_id: number) =>
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      this.updateSlot(ts_id, e.currentTarget.name, parseInt(e.currentTarget.value, 10));
    }

  updateSlotTool = (ts_id: number) => (ddi: DropDownItem) => {
    let { value } = ddi;
    let x = parseInt(JSON.stringify(value));
    if (_.isNaN(x)) {
      this.detachTool(ts_id);
    } else {
      this.updateSlot(ts_id, "tool_id", x);
    }
  }

  writeAxis = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ [e.currentTarget.name]: parseInt(e.currentTarget.value) });
  }

  writeToolId = (e: DropDownItem) => {
    let tool_id = parseInt(JSON.stringify(e.value));
    this.setState({ tool_id });
  }

  addNewSlot = (toolBayId: number) => {
    this.props.dispatch(addSlot(this.state, toolBayId));
    this.setState({ x: 0, y: 0, z: 0, tool_id: undefined });
  }

  render() {
    let { dispatch, toolBays } = this.props;
    let toggle = () => dispatch(toggleEditingToolBays());
    return <div>
      {toolBays.map(bay => {
        return <Widget key={bay.id}>
          <WidgetHeader
            helpText={t(`Toolbays are where you store your FarmBot Tools. Each
              Toolbay has Slots that you can put your Tools in, which should be
              reflective of your real FarmBot hardware configuration.`)}
            title={"ToolBay 1"}>
            <button
              className="gray button-like" onClick={toggle}>
              {t("Back")}
            </button>
            <button
              className="green button-like"
              onClick={() => dispatch(saveToolBay(bay.id, toolBays, toggle))}>
              {t("Save")}
            </button>
          </WidgetHeader>
          <WidgetBody>
            <Row>
              <Col xs={2}>
                <label>{t("Slot")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("X")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("Y")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("Z")}</label>
              </Col>
              <Col xs={3}>
                <label>{t("Tool")}</label>
              </Col>
            </Row>
            {this.props.getToolSlots(bay.id).map(
              (slot: ToolSlot, index: number) => {
                /** Existing tool slots form */
                return <Row key={slot.id}>
                  <Col xs={2}>
                    <label>{index + 1}</label>
                  </Col>
                  <Col xs={2}>
                    <BlurableInput
                      value={(slot.x || 0).toString()}
                      onCommit={this.updateSlotAxis(slot.id)}
                      type="number"
                      name="x"
                    />
                  </Col>
                  <Col xs={2}>
                    <BlurableInput
                      value={(slot.y || 0).toString()}
                      onCommit={this.updateSlotAxis(slot.id)}
                      type="number"
                      name="y"
                    />
                  </Col>
                  <Col xs={2}>
                    <BlurableInput
                      value={(slot.z || 0).toString()}
                      onCommit={this.updateSlotAxis(slot.id)}
                      type="number"
                      name="z"
                    />
                  </Col>
                  <Col xs={3}>
                    <FBSelect
                      list={this.props.getToolOptions()}
                      initialValue={this.props.getChosenToolOption(slot.id)}
                      onChange={this.updateSlotTool(slot.id)}
                      allowEmpty={true}
                    />
                  </Col>
                  <Col xs={1}>
                    <button
                      className="red button-like"
                      onClick={() => dispatch(destroySlot(slot.id))}>
                      <i className="fa fa-times" />
                    </button>
                  </Col>
                </Row>;
              })}
            {/** New tool slot form */}
            <Row>
              <Col xs={2}>
                <label>
                  {(this.props.getToolSlots(bay.id).length + 1) || ""}
                </label>
              </Col>
              <Col xs={2}>
                <BlurableInput
                  value={(this.state.x || 0).toString()}
                  onCommit={this.writeAxis}
                  type="number"
                  name="x"
                />
              </Col>
              <Col xs={2}>
                <BlurableInput
                  value={(this.state.y || 0).toString()}
                  onCommit={this.writeAxis}
                  type="number"
                  name="y"
                />
              </Col>
              <Col xs={2}>
                <BlurableInput
                  value={(this.state.z || 0).toString()}
                  onCommit={this.writeAxis}
                  type="number"
                  name="z"
                />
              </Col>
              <Col xs={3}>
                <FBSelect
                  list={this.props.getToolOptions()}
                  onChange={this.writeToolId}
                  allowEmpty={true}
                />
              </Col>
              <Col xs={1}>
                <button
                  className="green button-like"
                  onClick={() => this.addNewSlot(bay.id)}>
                  <i className="fa fa-plus" />
                </button>
              </Col>
            </Row>
          </WidgetBody>
        </Widget>;
      })}
    </div>;
  }
};
