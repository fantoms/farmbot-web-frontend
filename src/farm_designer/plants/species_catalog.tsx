import * as React from "react";
import { Link } from "react-router";
import { BackArrow } from "../../ui";
import { SearchBoxParams } from "../interfaces";
import { Everything } from "../../interfaces";
import { openFarmSearchQuery } from "../actions";
import { connect } from "react-redux";
import { t } from "i18next";

function SearchBox({ query, dispatch }: SearchBoxParams) {
  return <input value={query}
    onChange={(e) => doSearch(e, dispatch)}
    className="search"
    placeholder="Search OpenFarm" />;
}

function doSearch(e: React.FormEvent<HTMLInputElement>,
  dispatch: Function) {
  dispatch(openFarmSearchQuery(e.currentTarget.value));
}

@connect((state: Everything) => state)
export class SpeciesCatalog extends React.Component<Everything, {}> {
  render() {
    let { cropSearchResults, cropSearchQuery } = this.props.designer;

    let species = cropSearchResults.map(resp => {
      let { crop, image } = resp;
      return <Link key={resp.crop.slug}
        draggable={false}
        to={`/app/designer/plants/crop_search/` + crop.slug.toString()}>
        <div className="plant-catalog-tile col-xs-6">
          <label>{crop.name}</label>
          <img className="plant-catalog-image" src={image}
            draggable={false} />
        </div>
      </Link>;
    });

    return <div className="panel-container green-panel species-catalog-panel">
      <div className="panel-header green-panel">
        <p className="panel-title">
          <BackArrow /> {t("Choose a species")}
        </p>
      </div>
      <div className="panel-content">
        <div className="thin-search-wrapper">
          <i className="fa fa-search"></i>
          <div className="thin-search">
            <SearchBox query={cropSearchQuery}
              dispatch={this.props.dispatch} />
          </div>
        </div>
        <div className="panel-content">
          <div className="crop-search-result-wrapper row">
            {species}
          </div>
        </div>
      </div>
    </div>;
  }
}
