import * as React from "react";
import { t } from "i18next";
import {
  FarmEvent,
  AddFarmEventState,
  AddEditFarmEventProps
} from "../interfaces";
import {
  FBSelect,
  BlurableInput,
  Col,
  Row,
  BackArrow
} from "../../ui";
import * as moment from "moment";
import { connect } from "react-redux";
import { mapStateToPropsAddEdit, } from "./map_state_to_props_add_edit";

@connect(mapStateToPropsAddEdit)
export class AddFarmEvent extends React.Component<AddEditFarmEventProps,
AddFarmEventState> {
  constructor() {
    super();
    this.state = {
      next_time: new Date().toISOString(),
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      repeat: 0,
      time_unit: "daily"
    };
  }

  updateSequenceOrRegimen = (e: Partial<FarmEvent>) => {
    let { executable_id, executable_type } = e;
    this.setState({ executable_id, executable_type });
  }

  updateForm = (e: React.SyntheticEvent<HTMLInputElement>) => {
    switch (e.currentTarget.name) {
      case "start_time":
      case "end_time":
      case "repeat":
      case "time_unit":
      case "next_time":
        let { name, value } = e.currentTarget;
        return this.setState({ [name]: value });
      default:
        throw new Error("Tried to match field name but couldn't.");
    }
  }

  // Waiting until we figure out the fb_select deal before borrowing interfaces
  updateRepeatSelect = (e: { label: string, value: string, name: string }) => {
    this.setState({ time_unit: e.value });
  }

  updateTime = (e: React.SyntheticEvent<HTMLInputElement>) => {
    let { handleTime } = this.props;
    switch (e.currentTarget.name) {
      case "start_time":
        let newStart = handleTime(e, (this.state.start_time || "").toString());
        this.setState({ start_time: newStart });
        break;
      case "end_time":
        let newEnd = handleTime(e, (this.state.end_time || "").toString());
        this.setState({ end_time: newEnd });
        break;
    }
  }

  handleDate = (e: React.SyntheticEvent<HTMLInputElement>) => {
    switch (e.currentTarget.name) {
      case "start_date":
        let newStartDate = moment(e.currentTarget.value || "").toISOString();
        this.setState({ start_time: newStartDate });
        break;
      case "end_date":
        let newEndDate = moment(e.currentTarget.value || "").toISOString();
        this.setState({ end_time: newEndDate });
        break;
      default:
        throw new Error("Expected a name attribute from date field.");
    }
  }

  render() {
    let { formatDate, formatTime, selectOptions } = this.props;
    return <div className={`panel-container magenta-panel
            add-farm-event-panel`}>
      <div className="panel-header magenta-panel">
        <p className="panel-title">
          <BackArrow /> {t("Add Farm Event")}
        </p>
      </div>
      <div className="panel-content">
        <label>{t("Sequence or Regimen")}</label>
        <FBSelect
          list={selectOptions}
          onChange={this.updateSequenceOrRegimen} />
        <label>{t("Starts")}</label>
        <Row>
          <Col xs={6}>
            <BlurableInput
              type="date"
              className="add-event-start-date"
              name="start_date"
              value={formatDate((this.state.start_time ||
                new Date()).toString())}
              onCommit={this.handleDate} />
          </Col>
          <Col xs={6}>
            <BlurableInput type="time"
              className="add-event-start-time"
              name="start_time"
              value={formatTime((this.state.start_time ||
                new Date()).toString())}
              onCommit={this.updateTime} />
          </Col>
        </Row>
        <label>{t("Repeats Every")}</label>
        <Row>
          <Col xs={4}>
            <BlurableInput
              placeholder="(Number)"
              type="number"
              className="add-event-repeat-frequency"
              name="repeat"
              value={(this.state.repeat || 0).toString()}
              onCommit={this.updateForm} />
          </Col>
          <Col xs={8}>
            <FBSelect
              list={this.props.repeatOptions}
              onChange={this.updateRepeatSelect} />
          </Col>
        </Row>
        <label>{t("Until")}</label>
        <Row>
          <Col xs={6}>
            <BlurableInput
              type="date"
              className="add-event-end-date"
              name="end_date"
              value={formatDate((this.state.end_time ||
                new Date()).toString())}
              onCommit={this.handleDate} />
          </Col>
          <Col xs={6}>
            <BlurableInput
              type="time"
              name="end_time"
              className="add-event-end-time"
              value={formatTime((this.state.end_time ||
                new Date()).toString())}
              onCommit={this.updateTime} />
          </Col>
        </Row>
        <button className="magenta button-like"
          onClick={() => this.props.save(this.state)}>
          {t("Save")}
        </button>
      </div>
    </div>;
  }
}
