import * as React from "react";
import { BackArrow } from "../../ui";
import { Everything } from "../../interfaces";
import { connect } from "react-redux";
import { t } from "i18next";
import { isMobile } from "../../util";
import { DATA_URI, DEFAULT_ICON } from "../../open_farm/index";
import { SpeciesInfoProps, DraggableEvent } from "../interfaces";

@connect((state: Everything) => state)
export class SpeciesInfo extends React.Component<SpeciesInfoProps, {}> {
  handleDragStart(e: DraggableEvent) {
    let icon = e.currentTarget.getAttribute("data-icon-url");
    let img = document.createElement("img");
    icon ? img.src = DATA_URI + icon : DEFAULT_ICON;

    // TODO: Setting these doesn't work by default, needs a fix
    // https://www.w3.org/TR/2011/WD-html5-20110405/dnd.html#dom-datatransfer-setdragimage
    img.height = 50;
    img.width = 50;

    e.dataTransfer.setDragImage
      && e.dataTransfer.setDragImage(img, 50, 50);
  }

  findCrop(slug?: string) {
    let crops = this.props.designer.cropSearchResults;
    let crop = _(crops).find((result) => result.crop.slug === slug);
    return crop || {
      crop: {
        binomial_name: "binomial_name",
        common_names: "common_names",
        name: "name",
        row_spacing: "row_spacing",
        spread: "spread",
        description: "description",
        height: "height",
        processing_pictures: "processing_pictures",
        slug: "slug",
        sun_requirements: "sun_requirements",
        svg_icon: DEFAULT_ICON
      },
      image: "http://placehold.it/350x150"
    };
  }

  render() {
    let species = this.props.params.species.toString();
    let result = this.findCrop(species || "PLANT_NOT_FOUND");

    let addSpeciesPath = "/app/designer/plants/crop_search/" + species + "/add";

    /** rgba arguments are a more mobile-friendly way apply filters */
    let backgroundURL = isMobile() ? `linear-gradient(
      rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${result.image})` : "";

    return <div className="panel-container green-panel species-info-panel">
      <div className="panel-header green-panel"
        style={{ background: backgroundURL }}>
        <p className="panel-title">
          <BackArrow /> {result.crop.name}
          <a className="right-button mobile-only"
            onClick={() => this.props.router.push(addSpeciesPath)}>
            {t("Add to map")}
          </a>
        </p>
        <div className="panel-header-description">
          {result.crop.description}
        </div>
      </div>
      <div className="panel-content">
        <div className="crop-drag-info-tile">
          <img className="crop-drag-info-image"
            onDragStart={this.handleDragStart.bind(this)}
            draggable={true}
            src={result.image}
            data-icon-url={result.crop.svg_icon} />
          <div className="crop-info-overlay">
            {t("Drag and drop into map")}
          </div>
        </div>
        <div className="object-list">
          <label>
            {t("Crop Info")}
          </label>
          <ul>
            {
              _(result.crop)
                .omit([
                  "slug",
                  "processing_pictures",
                  "description",
                  "main_image_path"
                ])
                .pairs()
                .map(function (pair, i) {
                  let key = pair[0] as string;
                  let value = pair[1];
                  return <li key={i}>
                    <strong>
                      {_.startCase(key) + ": "}
                    </strong>
                    {/**
                     * Special use case for svgs here. If the key is the icon
                     * and has a value, render the elements needed, or "Not
                     * set". Any other keys receive the default behavior.
                     */}
                    {key === "svg_icon" && value && (
                      <div>
                        <img src={DATA_URI + value} width={100} height={100} />
                      </div>
                    ) || key === "svg_icon" && !value && ("Not set")}
                    {key !== "svg_icon" && (
                      value || "Not set"
                    )}
                  </li>;
                }).value()
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}
