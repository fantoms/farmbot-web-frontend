import * as React from "react";
import { Point } from "../interfaces";
const POINT_STYLES = {
  stroke: "green",
  strokeOpacity: 0.3,
  strokeWidth: "2",
  fill: "none",
};

interface Props {
  point: Point;
}

export function GardenPoint(props: Props) {
  let { point } = props;
  return <g>
    <circle cx={point.x}
      cy={point.y}
      r={point.radius / 20}
      {...POINT_STYLES} />
    <circle cx={point.x}
      cy={point.y}
      r={2}
      {...POINT_STYLES} />
  </g>;
}
