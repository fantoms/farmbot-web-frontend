import { OpenFarm } from "./openfarm";
import { DropDownItem } from "../ui/index";
import { Dictionary } from "farmbot/dist";
import { Sequence } from "../sequences/interfaces";
import { Regimen } from "../regimens/interfaces";
import { Everything } from "../interfaces";

export interface IndexProps extends Everything {
  params: {
    species: string;
    plant_id: string;
  };
}

export interface UpdateSequenceOrRegimenProps {
  label: string;
  value: number;
  kind: string;
  farm_event_id: number;
}

export type FarmEventForm = Partial<Record<keyof FarmEvent, string | number>>;

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
  readonly calendar?: string[] | undefined;
};

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
  radius: number;
  spread?: number | undefined;
  planting_area_id: string;
  icon_url: string; // ? Maybe this will change.
  openfarm_slug: string; // ? Maybe this will change.
}

export interface Specimen {
  id: number;
  name: string;
  imgUrl: string;
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

export type AddFarmEventState =
  Partial<Record<keyof FarmEvent, string | number>>;

export interface AddEditFarmEventProps {
  selectOptions: DropDownItem[];
  repeatOptions: DropDownItem[];
  farmEvents: FarmEvent[];
  sequenceById: Dictionary<Sequence>;
  regimenById: Dictionary<Regimen>;
  formatDate(input: string): string;
  formatTime(input: string): string;
  handleTime(e: React.SyntheticEvent<HTMLInputElement>, currentISO: string): string;
  save(fe: FarmEventForm): void;
  update(fe: FarmEventForm): void;
  delete(farm_event_id: number): void;
}

/** One CalendarDay has many CalendarOccurrences. For instance, a FarmEvent
 * that executes every 8 hours will create 3 CalendarOccurrences in a single
 * CalendarDay */
export interface CalendarOccurrence {
  sortKey: number;
  timeStr: string;
  executableName: string;
  executableId: number;
  id: number;
}

/** A group of FarmEvents for a particular day on the calendar. */
export interface CalendarDay {
  /** Unix timestamp. Used as a unique key in JSX and for sorting. */
  sortKey: string;
  month: string;
  day: number;
  /** Every event that will execute on that day. */
  items: CalendarOccurrence[];
}

export interface FarmEventProps {
  /** Sorted list of the first (100?) events due on the calendar. */
  calendarRows: CalendarDay[];
  /** Call this function to navigate to different pages. */
  push: (url: string) => void;
}

export interface GardenMapProps extends Everything {
  params: {
    species: string;
    plant_id: string;
  };
}

export interface GardenMapState {
  activePlant: Plant | undefined;
  tempX: number | undefined;
  tempY: number | undefined;
}

export interface GardenPlantProps {
  plant: Plant;
  onUpdate: (deltaX: number, deltaY: number, idx: number) => void;
  onDrop: (id: number) => void;
}

export interface GardenPointProps {
  point: Point;
}

export type PlantOptions = Partial<Plant>;

export interface SpeciesInfoProps extends Everything {
  params: { species: string; };
}

export interface EditPlantInfoProps extends Everything {
  params: { plant_id: string; };
}

export interface PlantInfoProps extends Everything {
  params: { plant_id: string };
}

export interface DNDSpeciesMobileState {
  isDragging: boolean;
}

export interface DraggableEvent {
  currentTarget: HTMLImageElement;
  dataTransfer: { setDragImage: Function; };
}

export interface SpeciesCatalogTileProps {
  result: CropLiveSearchResult;
  dispatch: Function;
}

export interface SearchBoxParams {
  query: string;
  dispatch: Function;
}

export interface DraggableSvgImageState {
  isDragging: boolean;
  mouseX: number;
  mouseY: number;
  radius: number;
}

export interface DraggableSvgImageProps {
  id: number;
  height: number;
  width: number;
  onUpdate: (deltaX: number, deltaY: number, idx: number) => void;
  onDrop: (id: number) => void;
  x: number;
  y: number;
  href: string;
}


