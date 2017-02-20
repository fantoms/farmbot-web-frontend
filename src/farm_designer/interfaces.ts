import { OpenFarm } from "./openfarm";
import { Regimen } from "../regimens/interfaces";
import { Sequence } from "../sequences/interfaces";
import { Option } from "react-select";

export interface SelectSequenceOrRegimenProps extends Option {
  /** Used to identify checking which id in what array to match. */
  kind?: string;
}

/** Used to associate dates with events in that are the same day */
export interface FinalEventData {
  date: string;
  finalEvents: FarmEventExecutableData[];
}

export interface UpdateSequenceOrRegimenProps {
  label: string;
  value: number;
  kind: string;
  farm_event_id: number;
}

export type TimeUnit = "never"
  | "minutely"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export interface FarmEvent {
  id?: number | undefined;
  start_time: string;
  end_time?: string | undefined;
  repeat?: number | undefined;
  time_unit: TimeUnit;
  next_time: string;
  executable_id: number;
  executable_type: string;
  calendar?: string[] | undefined;
};

export interface FarmEventExecutableData {
  farm_event_data: FarmEvent;
  executable_data: {
    name: string;
  };
}

export interface MovePlantProps {
  deltaX: number;
  deltaY: number;
  plantId: number;
}

export interface ScheduledEvent {
  time: Date;
  desc: string;
  icon: string;
};

/** OFCrop bundled with corresponding profile image from OpenFarm API. */
export interface CropLiveSearchResult {
  crop: OpenFarm.OFCrop;
  image: string;
}

export interface Plant {
  id?: number;
  dirty?: boolean | undefined;
  planted_at: string;
  img_url: string;
  name: string;
  x: number;
  y: number;
  planting_area_id: string;
  icon_url: string; // ? Maybe this will change.
  openfarm_slug: string; // ? Maybe this will change.
}

export interface Specimen {
  id: number;
  name: string;
  imgUrl: string;
}

export interface RegimenWithKindProp extends Regimen {
  kind: string;
}

export interface DesignerState {
  x_size: number;
  y_size: number;
  /** This causes too much data denormalization-
   *  let's just use state.sync.plants moving forward.
   */
  deprecatedPlants: Plant[];
  cropSearchQuery: string;
  cropSearchResults: CropLiveSearchResult[];
  currentSequenceOrRegimen: Partial<Sequence | RegimenWithKindProp | undefined>;
  farmEventToBeAdded: Partial<FarmEvent>;
}

export interface Point {
  id: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  created_at: string;
  meta: { [key: string]: (string | undefined) };
}
