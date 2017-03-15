import { RegimensState, Regimen, RegimenItem } from "./interfaces";
import { Sequence } from "../sequences/interfaces";
import { generateReducer } from "../redux/generate_reducer";
import { findWhere } from "lodash";

export function emptyRegimen(): Regimen {
  return {
    name: "Untitled Regimen",
    color: "gray",
    regimen_items: [],
    dirty: true
  };
}

const initialState: RegimensState = {
  all: [{
    name: "New Regimen",
    color: "gray",
    regimen_items: []
  }],
  current: 0
};

export let regimensReducer = generateReducer<RegimensState>(initialState)
  .add<{ regimen: Regimen, update: Regimen }>("EDIT_REGIMEN",
  function (state, action) {
    let update = _.assign<{},
      Regimen>({},
      action.payload.regimen,
      action.payload.update,
      { dirty: true });
    state.all[state.current] = update;
    return state;
  })
  .add<void>("DELETE_REGIMEN_OK", function (state, action) {
    state.all.splice(state.current, 1);
    state.current = (state.current <= 1) ? 0 : (state.current - 1);
    return state; // Lol this method is gross.
  })
  .add<void>("NEW_REGIMEN", function (state, action) {
    state.current = state.all.length;
    state.all.push(emptyRegimen());
    return state;
  })
  .add<number>("SELECT_REGIMEN", function (state, action) {
    state.current = action.payload;
    return state;
  })
  .add<Regimen>("COPY_REGIMEN", function (state, action) {
    let regi = action.payload;
    // Unset the ID to avoid accidentally overwriting parent.
    regi.id = undefined;
    regi.dirty = true;
    // "My regimen (copy 1)" => "My regimen"
    let baseName = regi.name.replace(/ \(copy \d*\)/, "");
    // TODO: This function has string typing, regexes and inband signalling.
    // I like to avoid all of those. Possible refactor target?
    let copies = _.select(state.all, function (item) {
      return (item.name.indexOf(baseName) !== -1);
    }).length;
    // Give it a name with the (copy X) stripped out
    regi.name = baseName;
    // Add the (copy X) back
    regi.name += ` (copy ${copies})`;
    state.current = state.all.length;
    state.all.push(regi);
    return state;
  })
  .add<{ index: number, regimenItems: RegimenItem[] }>
  ("COMMIT_BULK_EDITOR", function (state, action) {
    let { regimenItems, index } = action.payload;
    let ok = _.cloneDeep(regimenItems);
    let hmm = state.all[index].regimen_items;
    state.all[index].dirty = true;
    state.all[index].regimen_items = hmm.concat(ok);
    return state;
  })
  .add<Sequence>("SAVE_SEQUENCE_OK", function (state, action) {
    // This is the first time we've hit issues with denormalized data.
    // TODO: Investigate data normalization for the state tree.
    let id = action.payload.id;
    let sequence = action.payload;

    state
      .all
      .map(function (regimen) {
        regimen
          .regimen_items
          .map(function (ri) {
            if (ri.sequence.id === id) {
              ri.sequence = sequence;
            }
          });
      });

    return state;
  })
  .add<Regimen>("SAVE_REGIMEN_OK", function (state, action) {
    let current = _.find<Regimen>(state.all,
      r => r.name === action.payload.name);
    _.assign(current, action.payload, { dirty: false }); // Merge props.
    return state;
  })
  .add<RegimenItem>("REMOVE_REGIMEN_ITEM", function (state, action) {
    let list = state.all[state.current].regimen_items;
    let index = list.indexOf(findWhere(list, action.payload));
    if (index === -1) { throw new Error("Can't find that regimen."); }
    list.splice(index, 1);
    state.all[state.current].dirty = true;
    return state;
  })
  .add<Regimen[]>("FETCH_REGIMENS_OK", function (state, action) {
    state.all = action.payload;
    return state;
  });
