import { Thunk } from "../redux/interfaces";
import { Sync } from "../interfaces";
import { error } from "../ui";
import { API } from "../api";
import { t } from "i18next";
import * as axios from "axios";

export function fetchSyncData(): Thunk {
  return (dispatch: Function, getState: Function) => {
    axios.get<Sync>(API.current.syncPath)
      .then(({ data }) => {
        dispatch(fetchSyncDataOk(data));
      }, (e: Error) => {
        error(t("Could not download sync data"));
        dispatch(fetchSyncDataNo(e));
      });
  };
};

function fetchSyncDataOk(sync: Sync) {
  return {
    type: "FETCH_SYNC_OK",
    payload: sync
  };
}

function fetchSyncDataNo(err: Error) {
  return {
    type: "FETCH_SYNC_NO",
    payload: {}
  };
}
