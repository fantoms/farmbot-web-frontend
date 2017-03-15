import * as React from "react";
import { DraggableSvgImage } from "../draggable_svg_image";
import { GardenPlantProps } from "../interfaces";
import { cachedIcon, DEFAULT_ICON } from "../../open_farm/index";

export class GardenPlant extends React.Component<GardenPlantProps,
  { icon: string }> {
  constructor() {
    super();
    this.state = { icon: DEFAULT_ICON };
  }

  componentDidMount() {
    cachedIcon(this.props.plant.openfarm_slug)
      .then((icon: string) => this.setState({ icon }));
  }

  render() {
    let { plant, onUpdate, onDrop } = this.props;
    if (plant.id) {
      return <g>
        <circle className="map-plant-spread"
          cx={plant.x}
          cy={plant.y}
          r={(plant.spread || 0) * 10 / 2} />
        <DraggableSvgImage key={plant.id}
          x={plant.x - plant.radius}
          y={plant.y - plant.radius}
          height={plant.radius * 2}
          width={plant.radius * 2}
          id={plant.id}
          onUpdate={onUpdate}
          onDrop={onDrop}
          href={this.state.icon} />
      </g>;
    } else {
      throw new Error("Save plants before placing them on the map");
    }
  }
}
