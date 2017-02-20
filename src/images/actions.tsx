import * as Axios from "axios";
import { Thunk } from "../redux/interfaces";
import { Point } from "../farm_designer/interfaces";
import { API } from "../api";
import { success, error } from "../ui";
import { t } from "i18next";


const QUERY = { meta: { created_by: "plant-detection" } };
const URL = API.current.pointSearchPath;
export function resetWeedDetection(): Thunk {
  return async function (dispatch, getState) {
    try {
      let { data } = await Axios.post<Point[]>(URL, QUERY);
      let ids = data.map(x => x.id);
      // If you delete too many points, you will violate the URL length
      // limitation of 2,083. Chunking helps fix that.
      let chunks = _.chunk(ids, 300).map(function (chunk) {
        return Axios.delete(API.current.pointsPath + ids.join(","));
      });
      Promise.all(chunks)
        .then(function () {
          dispatch({
            type: "DELETE_POINT_OK",
            payload: ids
          });
          success(t("Deleted {{num}} weeds", { num: ids.length }));
        })
        .catch(function (e) {
          console.dir(e);
          error(t("Some weeds failed to delete. Please try again."));
        });
    } catch (e) {
      throw e;
    }
  };
};
