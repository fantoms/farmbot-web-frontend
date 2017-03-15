import * as React from "react";
import { RegimenItem } from "../interfaces";
import * as moment from "moment";
import { duration } from "moment";
import { removeRegimenItem } from "../actions";
import { t } from "i18next";
import * as _ from "lodash";
import { RegimenItemListProps, RegimenItemStepProps, RegimenItemDayGroupProps } from "./interfaces";

export function RegimenItemList({ items, dispatch }: RegimenItemListProps) {
  let groups = _.groupBy<RegimenItem>(items, function (item: RegimenItem) {
    return Math.round(duration(item.time_offset).asDays());
  });

  let list = _.map(groups, function (innerItems: RegimenItem[], day: string) {
    return <RegimenItemDayGroup day={day}
      items={innerItems}
      key={day}
      dispatch={dispatch} />;
  });

  let display = list.length ? list : <EmptyList />;
  return <div>
    <hr />
    {display}
  </div>;
}

function EmptyList({ }) {
  return <div>
    <p>{t("This regimen is currently empty.")}</p>
    <p><i className="fa fa-arrow-left" />
      {t(`Add sequences to this Regimen by using the "scheduler"`)}</p>
  </div>;
}

function RegimenItemStep({ item, dispatch }: RegimenItemStepProps) {
  let d = duration(item.time_offset);
  let time = moment({
    hour: d.hours(),
    minute: d.minutes()
  }).format("h:mm a");

  let klass = `${item.sequence.color || "gray"}-block block-header
    regimen-event`;

  return <div className={klass}>
    <span className="regimen-event-title">{item.sequence.name}</span>
    <span className="regimen-event-time">{time}</span>
    <i className="fa fa-trash regimen-control"
      onClick={() => dispatch(removeRegimenItem(item))} />
  </div>;
}

function RegimenItemDayGroup({ day,
  items,
  dispatch }: RegimenItemDayGroupProps) {
  return <div className="regimen-day">
    <label> {t("Day {{day}}", { day: parseInt(day, 10) })} </label>
    {items.map(function (item, inx) {
      return <RegimenItemStep item={item} key={inx} dispatch={dispatch} />;
    })}
  </div>;
}
