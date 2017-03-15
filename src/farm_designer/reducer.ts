import { Plant, CropLiveSearchResult } from "./interfaces";
import { Plant as newPlant } from "./plant";
import { generateReducer } from "../redux/generate_reducer";
import { DesignerState } from "./interfaces";
import { cloneDeep } from "lodash";
import { HardwareState } from "../devices/interfaces";
import { Sync } from "../interfaces";

let DEFAULT_STATE: DesignerState = {
  deprecatedPlants: [],
  x_size: 0,
  y_size: 0,
  cropSearchQuery: "",
  cropSearchResults: []
};

export let designer = generateReducer<DesignerState>(DEFAULT_STATE)
  .add<Sync>("FETCH_SYNC_OK", function (s, a) {
    let state = cloneDeep(s);
    state.deprecatedPlants = a.payload.plants || [];
    return state;
  })
  .add<Plant>("SAVE_PLANT_OK", function (s, a) {
    // Exxxttrraaa runtime safety.
    let plant = newPlant(a.payload);
    s.deprecatedPlants.push(plant);
    return s;
  })
  .add<Plant>("DESTROY_PLANT_OK", function (s, { payload }) {
    let state = cloneDeep(s);
    let a = state.deprecatedPlants;
    a.splice(a.indexOf(payload), 0);
    return state;
  })
  .add<HardwareState>("BOT_CHANGE", function (s, { payload }) {
    let state = cloneDeep(s);
    let [x, y] = [
      payload.mcu_params.movement_axis_nr_steps_x,
      payload.mcu_params.movement_axis_nr_steps_y
    ];
    if (x && y) {
      state.x_size = x;
      state.y_size = y;
    }
    return state;
  })
  .add<string>("SEARCH_QUERY_CHANGE", function (s, { payload }) {
    let state = cloneDeep(s);
    state.cropSearchQuery = payload;
    return state;
  })
  .add<CropLiveSearchResult[]>("OF_SEARCH_RESULTS_OK",
  function (s, { payload }) {
    let state = cloneDeep(s);
    state.cropSearchResults = payload;
    return state;
  });
