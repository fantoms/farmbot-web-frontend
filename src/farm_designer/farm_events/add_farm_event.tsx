import * as React from "react";
import { BackArrow } from "../back_arrow";
import { t } from "i18next";
import { Select, BetaSelect, DropDownItem, error, BlurableInput } from "../../ui";
import { connect } from "react-redux";
import { Everything } from "../../interfaces";
import { SelectSequenceOrRegimenProps } from "../interfaces";
import {
  selectSequenceOrRegimen,
  saveFarmEvent,
  addFarmEventStart,
  addFarmEventRepeat,
  addFarmEventEnd,
  addFarmEventTimeUnit
} from "../actions";
import * as _ from "lodash";
import * as moment from "moment";

@connect((state: Everything) => state)
export class AddFarmEvent extends React.Component<Everything, {}> {
  selectFromDropDown(e: SelectSequenceOrRegimenProps) {
    let { regimens, sequences } = this.props;

    /* Depending on the kind chosen, place that in the state tree
    /* e.value is the id of the node */
    switch (e.kind) {
      case "Regimen":
        let regimen = _.findWhere(regimens.all, { id: e.value });
        this.props.dispatch(selectSequenceOrRegimen(regimen));
        break;

      case "Sequence":
        let sequence = _.findWhere(sequences.all, { id: e.value });
        this.props.dispatch(selectSequenceOrRegimen(sequence));
        break;

      default:
        throw new Error("Error in the executable dropdown.");
    }
  }

  saveEvent() {
    let {
      farmEventToBeAdded,
      currentSequenceOrRegimen
    } = this.props.designer;

    if (currentSequenceOrRegimen && currentSequenceOrRegimen.kind) {
      let kind = _.capitalize(currentSequenceOrRegimen.kind.toString());

      let data = _.assign({
        executable_id: currentSequenceOrRegimen.id,
        executable_type: kind
      }, farmEventToBeAdded);

      let success = () => this.props.router.push("/app/designer/farm_events");
      this.props.dispatch(saveFarmEvent(data, success));
    } else {
      error("Select a sequence or Regimen.");
    }
  }

  updateStart(event: React.SyntheticEvent<HTMLInputElement>) {
    let { name, value } = event.currentTarget;
    this.props.dispatch(addFarmEventStart(name, value));
  }

  updateRepeat(event: React.SyntheticEvent<HTMLInputElement>) {
    let { value } = event.currentTarget;
    let newValue = parseInt(value);
    // TODO: Come back when API stuff is cleared up.
    this.props.dispatch(addFarmEventRepeat(newValue));
  }

  updateTimeUnit(event: DropDownItem) {
    let { value } = event;
    this.props.dispatch(addFarmEventTimeUnit(value));
  }

  addFarmEventEnd(event: React.SyntheticEvent<HTMLInputElement>) {
    let { name, value } = event.currentTarget;
    this.props.dispatch(addFarmEventEnd(name, value));
  }

  render() {
    let { regimens, sequences } = this.props;
    let {
      start_time,
      repeat,
      time_unit,
      end_time
    } = this.props.designer.farmEventToBeAdded;

    let eventStartDate = start_time ? moment(start_time)
      .format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

    let eventEndDate = end_time ? moment(end_time)
      .format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

    let eventStartTime = start_time ? moment(start_time)
      .format("HH:mm") : moment().format("HH:mm");

    let eventEndTime = end_time ? moment(end_time)
      .format("HH:mm") : moment().format("HH:mm");

    let eventRepeat = repeat ? repeat : 1;
    let eventTimeUnit = time_unit ? time_unit : "";

    let regimenOptions: DropDownItem[] = regimens.all.map(reg => {
      return {
        label: reg.name || "No regimens.",
        value: (reg || {}).id,
        kind: "Regimen"
      };
    });

    /** For group-by styling */
    regimenOptions.unshift({ label: "Regimens", heading: true });

    let sequencesOptions: DropDownItem[] = sequences.all.map(seq => {
      return {
        label: seq.name || "No sequences.",
        value: (seq || {}).id,
        kind: "Sequence"
      };
    });

    /** For group-by styling */
    sequencesOptions.unshift({ label: "Sequences", heading: true });

    /** For telling select box */
    let chosenNode = this.props.designer.currentSequenceOrRegimen;

    let repeatOptions = [
      { label: "Do not repeat", value: "never" },
      { label: "minutes", value: "minutely" },
      { label: "hours", value: "hourly" },
      { label: "days", value: "daily" },
      { label: "weeks", value: "weekly" },
      { label: "months", value: "monthly" },
      { label: "years", value: "yearly" }
    ];

    return <div className={`panel-container magenta-panel 
            add-farm-event-panel`}>
      <div className="panel-header magenta-panel">
        <p className="panel-title">
          <BackArrow /> {t("Add Farm Event")}
        </p>
      </div>
      <div className="panel-content">
        <label>{t("Sequence or Regimen")}</label>
        <BetaSelect
          dropDownItems={regimenOptions.concat(sequencesOptions)}
          onChange={this.selectFromDropDown.bind(this)}
          value={(chosenNode || {}).id || null} />

        {/*<label>{t("Parameters")}</label>*/}

        <label>{t("Starts")}</label>
        <div className="row">
          <div className="col-xs-6">
            <BlurableInput
              type="date"
              className="add-event-start-date"
              name="start_date"
              value={eventStartDate}
              onCommit={this.updateStart.bind(this)} />
          </div>
          <div className="col-xs-6">
            <BlurableInput type="time"
              className="add-event-start-time"
              name="start_time"
              value={eventStartTime}
              onCommit={this.updateStart.bind(this)} />
          </div>
        </div>
        <label>{t("Repeats Every")}</label>
        <div className="row">
          <div className="col-xs-4">
            <input placeholder="(Number)"
              type="number"
              className="add-event-repeat-frequency"
              name="repeat"
              value={eventRepeat}
              onChange={this.updateRepeat.bind(this)} />
          </div>
          <div className="col-xs-8">
            <Select
              options={repeatOptions}
              name="time_unit"
              value={eventTimeUnit}
              onChange={this.updateTimeUnit.bind(this)} />
          </div>
        </div>
        <label>{t("Until")}</label>
        <div className="row">
          <div className="col-xs-6">
            <BlurableInput
              type="date"
              className="add-event-end-date"
              name="end_date"
              value={eventEndDate}
              onCommit={this.addFarmEventEnd.bind(this)} />
          </div>
          <div className="col-xs-6">
            <BlurableInput
              type="time"
              name="end_time"
              className="add-event-end-time"
              value={eventEndTime}
              onCommit={this.addFarmEventEnd.bind(this)} />
          </div>
        </div>
        <button className="magenta button-like"
          onClick={this.saveEvent.bind(this)}>
          {t("Save")}
        </button>
      </div>
    </div>;
  }
}
