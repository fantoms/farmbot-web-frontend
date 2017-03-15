import * as React from "react";
import { BackArrow } from "../../ui";
import { Everything } from "../../interfaces";
import { connect } from "react-redux";
import * as moment from "moment";
import { destroyPlant } from "../actions";
import { t } from "i18next";
import { EditPlantInfoProps } from "../interfaces";

@connect((state: Everything) => state)
export class EditPlantInfo extends React.Component<EditPlantInfoProps, {}> {
  destroy() {
    let plant_id = parseInt(this.props.params.plant_id);
    this.props.dispatch(destroyPlant(plant_id));
    this.props.router.push("/app/designer/plants");
  }

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
          <BackArrow />
          <span className="title">{t("Edit")} {name}</span>
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
        <label>{t("Delete this plant")}</label>
        <div>
          <button className="red button-like left"
            onClick={this.destroy.bind(this)}>
            {t("Delete")}
          </button>
        </div>
      </div>
    </div>;
  }
}
