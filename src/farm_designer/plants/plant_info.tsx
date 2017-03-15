import * as React from "react";
import { Link } from "react-router";
import { Everything } from "../../interfaces";
import { connect } from "react-redux";
import * as moment from "moment";
import { t } from "i18next";
import { PlantInfoProps } from "../interfaces";

@connect((state: Everything) => state)
export class PlantInfo extends React.Component<PlantInfoProps, {}> {
  render() {
    let plant_id = parseInt(this.props.params.plant_id);
    let plants = this.props.designer.deprecatedPlants;
    let currentPlant = _.findWhere(plants, { id: plant_id });

    let { name, x, y, planted_at } = currentPlant;

    let dayPlanted = moment();
    // Same day = 1 !0
    let daysOld = dayPlanted.diff(moment(planted_at), "days") + 1;
    let plantedAt = moment(planted_at).format("MMMM Do YYYY, h:mma");

    return <div className="panel-container green-panel">
      <div className="panel-header green-panel">
        <p className="panel-title">
          <Link to={`/app/designer/plants`} className="back-arrow">
            <i className="fa fa-arrow-left"></i>
          </Link>
          <span className="title">{name}</span>
          <Link to={`/app/designer/plants/` + plant_id.toString() + `/edit`}
            className="right-button">
            {t("Edit")}
          </Link>
        </p>
      </div>
      <div className="panel-content">
        <label>{t("Plant Info")}</label>
        <ul>
          <li>{t("Started")}: {plantedAt}</li>
          <li>{t("Age")}: {daysOld}</li>
          <li>{t("Location")}: ({x}, {y})</li>
        </ul>
        <label>{t("Regimens")}</label>
        <ul>
          <li>Soil Acidifier</li>
        </ul>
      </div>
    </div>;
  }
}
