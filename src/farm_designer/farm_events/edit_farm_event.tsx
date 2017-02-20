import * as React from "react";
import { BackArrow } from "../back_arrow";
import { t } from "i18next";
import { Select, BlurableInput } from "../../ui";
import { connect } from "react-redux";
import {
  Everything,
  SelectOptionsParams,
  CustomOptionProps
} from "../../interfaces";
import {
  SelectSequenceOrRegimenProps,
  UpdateSequenceOrRegimenProps
} from "../interfaces";
import {
  DropDownItem
} from "../../ui/beta_select";
import {
  selectSequenceOrRegimen,
  updateFarmEvent,
  updateFarmEventStart,
  updateFarmEventRepeat,
  updateFarmEventEnd,
  updateFarmEventTimeUnit,
  destroyFarmEvent,
  updateSequenceOrRegimen
} from "../actions";
import * as _ from "lodash";
import * as moment from "moment";

interface EditFarmEventProps extends Everything {
  params: {
    farm_event_id: string;
  };
}

class OptionComponent extends React.Component<CustomOptionProps, {}> {
  handleMouseDown(e: React.SyntheticEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSelect(this.props.option, e);
  };

  handleMouseEnter(e: React.SyntheticEvent<HTMLDivElement>) {
    this.props.onFocus(this.props.option, e);
  };

  handleMouseMove(e: React.SyntheticEvent<HTMLDivElement>) {
    if (this.props.isFocused) { return; };
    this.props.onFocus(this.props.option, e);
  };

  render() {
    return (
      <div className={this.props.className}
        onMouseDown={this.handleMouseDown.bind(this)}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}>
        {this.props.children}
      </div>
    );
  }
}

@connect((state: Everything) => state)
export class EditFarmEvent extends React.Component<EditFarmEventProps, {}> {
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
    let { sync, dispatch } = this.props;
    let id = parseInt(this.props.params.farm_event_id);
    let currentEvent = _.findWhere(sync.farm_events, { id });
    dispatch(updateFarmEvent(currentEvent));
    this.props.router.push("/app/designer/farm_events");
  }

  deleteEvent() {
    let id = parseInt(this.props.params.farm_event_id);
    this.props.dispatch(destroyFarmEvent(id));
    this.props.router.push("/app/designer/farm_events");
  }

  updateSequenceOrRegimenOption(e: UpdateSequenceOrRegimenProps) {
    e.farm_event_id = parseInt(this.props.params.farm_event_id);
    this.props.dispatch(updateSequenceOrRegimen(e));
  }

  updateStart(event: React.SyntheticEvent<HTMLInputElement>) {
    let { name, value } = event.currentTarget;
    let id = parseInt(this.props.params.farm_event_id);
    this.props.dispatch(updateFarmEventStart(name, value, id));
  }

  updateRepeat(event: React.SyntheticEvent<HTMLInputElement>) {
    let { value } = event.currentTarget;
    let newValue = parseInt(value);
    let id = parseInt(this.props.params.farm_event_id);
    this.props.dispatch(updateFarmEventRepeat(newValue, id));
  }

  updateTimeUnit(event: DropDownItem) {
    let { value } = event;
    let id = parseInt(this.props.params.farm_event_id);
    this.props.dispatch(updateFarmEventTimeUnit(value, id));
  }

  updateFarmEventEnd(event: React.SyntheticEvent<HTMLInputElement>) {
    let { name, value } = event.currentTarget;
    let id = parseInt(this.props.params.farm_event_id);
    this.props.dispatch(updateFarmEventEnd(name, value, id));
  }

  render() {
    let { regimens, sequences, sync, params } = this.props;
    let currentEvent = _.findWhere(sync.farm_events,
      { id: parseInt(params.farm_event_id) });

    let {
      start_time,
      repeat,
      time_unit,
      end_time
    } = currentEvent;

    let eventStartDate = start_time ? moment(start_time)
      .format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

    let eventEndDate = end_time ? moment(end_time)
      .format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

    let eventStartTime = start_time ? moment(start_time)
      .format("HH:mm") : moment().format("HH:mm");

    let eventEndTime = end_time ? moment(end_time)
      .format("HH:mm") : moment().format("HH:mm");

    let eventRepeat = repeat ? repeat : 0;
    let eventTimeUnit = time_unit ? time_unit : "";

    let regimenOptions: SelectOptionsParams[] = regimens.all.map(reg => {
      return {
        label: reg.name || "No regimens.",
        value: reg.id || 0,
        kind: "Regimen"
      };
    });

    /** Hack for group-by styling :( */
    regimenOptions.unshift({ label: "Regimens", value: 0, disabled: true });

    let sequencesOptions: SelectOptionsParams[] = sequences.all.map(seq => {
      return {
        label: seq.name || "No sequences.",
        value: seq.id || 0,
        kind: "Sequence"
      };
    });

    /** Hack for group-by styling :( */
    sequencesOptions.unshift({
      label: "Sequences",
      value: 0,
      disabled: true
    });

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
            edit-farm-event-panel`}>
      <div className="panel-header magenta-panel">
        <p className="panel-title">
          <BackArrow /> {t("Edit Farm Event")}
        </p>
      </div>
      <div className="panel-content">
        <label>{t("Sequence or Regimen")}</label>
        <Select
          className="group-by"
          options={regimenOptions.concat(sequencesOptions)}
          optionComponent={OptionComponent}
          onChange={this.updateSequenceOrRegimenOption.bind(this)}
          value={(currentEvent || {}).executable_id || 0} />

        {/*<label>{t("Parameters")}</label>*/}

        <label>{t("Starts")}</label>
        <div className="row">
          <div className="col-xs-6">
            <BlurableInput type="date"
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
              type="text"
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
              onCommit={this.updateFarmEventEnd.bind(this)} />
          </div>
          <div className="col-xs-6">
            <BlurableInput
              type="time"
              className="add-event-end-time"
              name="end_time"
              value={eventEndTime}
              onCommit={this.updateFarmEventEnd.bind(this)} />
          </div>
        </div>
        <button className="magenta button-like"
          onClick={this.saveEvent.bind(this)}>
          {t("Save")}
        </button>
        <button className="red button-like"
          onClick={this.deleteEvent.bind(this)}>
          {t("Delete")}
        </button>
      </div>
    </div>;
  }
}
