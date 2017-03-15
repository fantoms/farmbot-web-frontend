import * as Axios from "axios";
import { error, success } from "../ui";
import { Plant, MovePlantProps, FarmEvent, FarmEventForm } from "./interfaces";
import { Thunk } from "../redux/interfaces";
import { CropSearchResult, OpenFarm } from "./openfarm";
import { t } from "i18next";
import * as _ from "lodash";
import { API } from "../api";
import { Everything } from "../interfaces";
import { findPlantById } from "../sync/reducer";
import { prettyPrintApiErrors } from "../util";
import { DEFAULT_ICON } from "../open_farm/index";

export function saveFarmEvent(farm_event: FarmEventForm,
  callback: () => void): Thunk {
  let url = API.current.farmEventsPath;
  return function (dispatch, getState) {
    return Axios.post<FarmEvent>(url, farm_event)
      .then(resp => {
        if (resp instanceof Error) {
          error(prettyPrintApiErrors(resp));
          throw resp;
        }
        let payload = { ...farm_event, ...resp.data };
        dispatch({ type: "SAVE_FARM_EVENT_OK", payload });
        success(t("Successfully saved event."));
        callback();
      });
  };
};

export function updateFarmEvent(farm_event: FarmEventForm,
  callback: () => void): Thunk {
  let url = API.current.farmEventsPath + farm_event.id;
  return function (dispatch, getState) {
    return Axios.patch<FarmEvent>(url, farm_event)
      .then(resp => {
        let payload = { ...farm_event, ...resp.data };
        dispatch({ type: "UPDATE_FARM_EVENT_OK", payload });
        success(t("Successfully saved event."));
        callback();
      })
      .catch(payload => {
        error(t("Tried to update Farm Event, but couldn't."));
      });
  };
};

export function destroyFarmEvent(farm_event_id: number,
  callback: () => void): Thunk {
  let url = API.current.farmEventsPath + farm_event_id;
  return function (dispatch, getState) {
    return Axios.delete<Partial<FarmEvent>>(url, farm_event_id)
      .then(resp => {
        let payload = { id: farm_event_id, ...resp.data };
        dispatch({ type: "DELETE_FARM_EVENT_OK", payload });
        success("Deleted farm event.", "Deleted");
        callback();
      })
      .catch(payload => {
        error(t("Tried to delete Farm Event, but couldn't."));
      });
  };
};

/** Deprecating this in favor of the new savePlant() method which users
 * sync object rather than duplicating state.
 */
export function deprecatedSavePlant(plant: Plant): Thunk {
  let url = API.current.plantsPath;
  return function (dispatch, getState) {
    return Axios.post<Plant>(url, plant)
      .then(resp => {
        let payload: Plant = { ...plant, ...resp.data };
        dispatch({ type: "SAVE_PLANT_OK", payload });
      })
      .catch(payload => {
        error(t("Tried to save plant, but couldn't."));
      });
  };
};

export function savePlantById(id: number): Thunk {
  let url = API.current.plantsPath;
  return function (dispatch, getState) {
    let s = getState() as Everything;
    let plant: Plant = findPlantById(s.sync.plants, id);
    return Axios.put<Partial<Plant>>(url + `/${id}`, plant)
      .then(resp => {
        let payload = { ...plant, ...resp.data };
        dispatch({ type: "UPDATE_PLANT_OK", payload });
      })
      .catch(payload => {
        error(t("Tried to save plant, but couldn't."));
      });
  };
};

export function movePlant(payload: MovePlantProps) {
  return { type: "MOVE_PLANT", payload };
};

export function destroyPlant(plant_id: number): Thunk {
  let url = API.current.plantsPath + plant_id;
  return function (dispatch, getState) {
    dispatch({ type: "DESTROY_PLANT_START" });
    return Axios.delete<Plant>(url)
      .then(resp => {
        let payload = plant_id;
        dispatch({ type: "DESTROY_PLANT_OK", payload });
        success("Successfully deleted plant.", "Deleted");
      })
      .catch(payload => {
        error(t("Tried to delete plant, but couldn't."));
        dispatch({ type: "DESTROY_PLANT_ERR", payload });
      });
  };
};

let STUB_IMAGE = DEFAULT_ICON;
let url = (q: string) => `${OpenFarm.cropUrl}?include=pictures&filter=${q}`;
// If we do a search on keypress, we will DDoS OpenFarm.
// This function prevents that from happening by pausing X ms
// per keystroke.
let _openFarmSearchQuery = _.throttle((q: string) => Axios.get<CropSearchResult>(url(q)), 1500);

/** Search openfarm for crops. This is a throttled function, useful for live search. */
export function openFarmSearchQuery(query: string) { // TODO make less smelly
  return function (dispatch: Function) {
    dispatch({
      type: "SEARCH_QUERY_CHANGE",
      payload: query
    });
    return _openFarmSearchQuery(query)
      .then(resp => {
        // Pluck ID and URL of user-submitted OpenFarm crops...
        // EG: => { X1y3ZAA: "cabbage.png" }
        let images: { [key: string]: string } = {};

        _.get<OpenFarm.Included[]>(resp, "data.included", [])
          .map(item => {
            return {
              id: item.id,
              url: item.attributes.thumbnail_url
            };
          })
          .map((val, acc) => images[val.id] = val.url);

        let payload = resp.data.data.map(datum => {
          let crop = datum.attributes;
          let id = _.get<string>(datum, "relationships.pictures.data[0].id");
          return { crop, image: (images[id] || STUB_IMAGE) };
        });

        dispatch({
          type: "OF_SEARCH_RESULTS_OK",
          payload
        });
      });
  };
};
