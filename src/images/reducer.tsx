import { generateReducer } from "../redux/generate_reducer";
import { ImageState } from "./interfaces";
import { Sync } from "../interfaces";

let initialState: ImageState = {
  all: []
};

export let configReducer = generateReducer<ImageState>(initialState)
  .add<Sync>("FETCH_SYNC_OK", function (state, action) {
    state.all = action.payload.images || [];
    return state;
  });

