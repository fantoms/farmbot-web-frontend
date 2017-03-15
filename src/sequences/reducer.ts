import {
  SequenceBodyItem as Step,
  LATEST_VERSION
} from "farmbot";
import {
  Sequence,
  SequenceReducerState,
  ChanParams,
  MessageParams,
  ChangeMoveAbsSelect,
  ChangeMoveAbsInput,
  EditCurrentSequence,
  SelectPayl,
  MoveStepPayl,
  SpliceStepPayl
} from "./interfaces";
import { nullSequence } from "./actions";
import { generateReducer } from "../redux/generate_reducer";
import { move } from "../util";
import * as _ from "lodash";
import { Sync } from "../interfaces";
import { SequenceBodyItem, uuid } from "farmbot";
/** Adds an empty sequence to the front of the list. */
function populate(s: SequenceReducerState): Sequence {
  // This worries me. What if #current and #all get out of sync?
  let current_sequence = nullSequence();
  s.all.unshift(current_sequence);
  s.current = 0;
  maybeAddMarkers(s);
  return current_sequence;
}

const initialState: SequenceReducerState = {
  all: [
    {
      color: "red",
      kind: "sequence",
      args: { version: LATEST_VERSION },
      name: "New Sequence",
      body: [],
      dirty: false
    }
  ],
  current: 0
};

export let sequenceReducer = generateReducer<SequenceReducerState>(initialState)
  .add<ChanParams>("ADD_CHANNEL", function (s, a) {
    let { index, channel_name } = a.payload;
    let seq = s.all[s.current];
    seq.dirty = true;
    let step = (seq.body || [])[index];
    if (step.kind === "send_message") {
      step.body = step.body || [];
      step.body.push({ kind: "channel", args: { channel_name } });
      step.body = _.uniq(step.body, (t) => t.args.channel_name);
    } else {
      throw new Error("ADD_CHANNEL only works on `send_message` nodes.");
    }
    return s;
  })
  .add<ChanParams>("REMOVE_CHANNEL", function (s, a) {
    let { index, channel_name } = a.payload;
    let seq = s.all[s.current];
    seq.dirty = true;
    let step = (seq.body || [])[index];
    if (step.kind === "send_message") {
      step.body = step.body || [];
      step.body.push({ kind: "channel", args: { channel_name } });
      step.body = _.select(step.body, function (t) {
        return t.args.channel_name !== channel_name;
      });
    } else {
      throw new Error("ADD_CHANNEL only works on `send_message` nodes.");
    }
    return s;
  })
  .add<MessageParams>("UPDATE_MESSAGE_TYPE", function (s, a) {
    let { value, index } = a.payload;
    let seq = s.all[s.current];
    seq.dirty = true;
    let step = (seq.body || [])[index];
    if (step.kind === "send_message") {
      step.args.message_type = (value || "info").toString();
    }
    return s;
  })
  .add<{ index: number, comment: string }>("ADD_COMMENT", function (s, a) {
    let seq = s.all[s.current];
    let node = (seq.body || [])[a.payload.index];
    markDirty(s);
    node.comment = a.payload.comment;
    // API complains about empty values.
    // TODO: Clean up BE.
    if (!node.comment) { delete node.comment; }
    return s;
  })
  .add<{ step: Step }>("PUSH_STEP", function (s, a) {
    let current_sequence = s.all[s.current] || populate(s);
    markDirty(s);
    let { step } = a.payload;
    let stepp = step as SequenceBodyItem;
    (stepp as any).uuid = uuid();
    (current_sequence.body || []).push(stepp);
    maybeAddMarkers(s);
    return s;
  })
  .add<void>("ADD_SEQUENCE", function (s, a) {
    populate(s);
    maybeAddMarkers(s);
    return s;
  })
  .add<EditCurrentSequence>("EDIT_CURRENT_SEQUENCE", function (s, a) {
    let currentSequence = s.all[s.current] || populate(s);
    currentSequence.name = a.payload.name || currentSequence.name;
    currentSequence.color = a.payload.color || currentSequence.color;
    markDirty(s);
    maybeAddMarkers(s);
    return s;
  })
  .add<{ step: Step, index: number }>("CHANGE_STEP", function (s, a) {
    let currentSequence = s.all[s.current];
    let currentStep = (currentSequence.body || [])[a.payload.index];
    markDirty(s);
    _.assign(currentStep, a.payload.step);
    maybeAddMarkers(s);
    return s;
  })
  .add<SelectPayl>("CHANGE_STEP_SELECT", function (s, a) {
    markDirty(s);
    let currentSequence = s.all[s.current];
    let currentStep = (currentSequence.body || [])[a.payload.index];
    let { field, value } = a.payload;

    // TODO: Any - replace using `keyof` operator.
    let raw = currentStep.args as any;
    raw[field] = value;
    maybeAddMarkers(s);
    return s;
  })
  .add<SelectPayl>("UPDATE_SUB_SEQUENCE", function (s, a) {
    markDirty(s);
    let currentSequence = s.all[s.current];
    let currentStep = (currentSequence.body || [])[a.payload.index];
    let { value, type } = a.payload;

    /** This kinda sucks. A lot is because of pleasing TS.
     * Eligible for a refactor.
     */
    if (currentStep.kind === "_if" && type === "_then" && value) {
      let sequence_id = parseInt(value.toString());
      currentStep.args._then = {
        kind: "execute",
        args: { sequence_id }
      };
    } else if (currentStep.kind === "_if" && type === "_else" && value) {
      let sequence_id = parseInt(value.toString());
      currentStep.args._else = {
        kind: "execute",
        args: { sequence_id }
      };
    } else if (currentStep.kind === "_if" && type === "_then") {
      currentStep.args._then = {
        kind: "nothing",
        args: {}
      };
    } else if (currentStep.kind === "_if" && type === "_else") {
      currentStep.args._else = {
        kind: "nothing",
        args: {}
      };
    } else {
      throw new Error("Error updating sub sequences.");
    }
    maybeAddMarkers(s);
    return s;
  })
  .add<ChangeMoveAbsSelect>("CHANGE_MOVE_ABS_STEP_SELECT",
  function (s, a) {
    let currentSequence = s.all[s.current];
    let currentStep = (currentSequence.body || [])[a.payload.index];
    let choice = a.payload.tool;
    if (currentStep && currentStep.kind === "move_absolute") {
      if (_.isNumber(choice.value)) {
        currentStep.args.location = {
          kind: "tool",
          args: { tool_id: choice.value }
        };
      } else {
        currentStep.args.location = {
          kind: "coordinate",
          args: { x: 0, y: 0, z: 0 }
        };
      }
    } else {
      throw new Error("Something threw bad data to " +
        "CHANGE_MOVE_ABS_STEP_SELECT");
    }
    markDirty(s);
    maybeAddMarkers(s);
    return s;
  })
  .add<ChangeMoveAbsInput>("CHANGE_MOVE_ABS_STEP_VALUE",
  function (s, a) {
    let currentSequence = s.all[s.current];
    let currentStep = (currentSequence.body || [])[a.payload.index];
    markDirty(s);
    // TODO: still can't get this figured out
    let raw = currentStep.args as any;

    // Super lame, but modular? i.e. "offset-x", "location-z"
    let kind = a.payload.kind.split("-")[0];
    let arg = a.payload.kind.split("-")[1];

    switch (kind) {
      case "location":
        raw.location.args[arg] = parseInt(a.payload.value);
        maybeAddMarkers(s);
        return s;
      case "offset":
        raw.offset.args[arg] = parseInt(a.payload.value);
        maybeAddMarkers(s);
        return s;
      default:
        throw new Error(`Something went wrong with the
        move_abs input parameters.`);
    }
  })
  .add<{ index: number }>("REMOVE_STEP", function (s, a) {
    let body = s.all[s.current].body || [];
    let index = a.payload.index;
    body.splice(index, 1);
    markDirty(s);
    return s;
  })
  .add<Sequence>("SAVE_SEQUENCE_OK", function (s, a) {
    s.all[s.current] = a.payload;
    maybeAddMarkers(s);
    return s;
  })
  .add<Sync>("FETCH_SYNC_OK", function (s, a) {
    // HERE
    s.all = a.payload.sequences || [];
    maybeAddMarkers(s);
    return s;
  })
  .add<number>("SELECT_SEQUENCE", function (s, a) {
    let inx = a.payload;
    if (s.all[inx]) { s.current = inx; }
    maybeAddMarkers(s);
    return s;
  })
  .add<Sequence>("DELETE_SEQUENCE_OK", function (s, a) {
    let found = _.find(s.all, { name: a.payload.name });
    if (found) {
      _.pull(s.all, found);
      s.current = 0;
    } else {
      throw new Error("Tried to delete a sequence that doesn't exist. ");
    }
    maybeAddMarkers(s);
    return s;
  })
  .add<Sequence>("COPY_SEQUENCE", function (s, a) {
    let seq = a.payload;
    // Unset the ID to avoid accidentally overwriting parent.
    seq.id = undefined;
    seq.dirty = true;
    // "My sequence (copy 1)" => "My sequence"
    let baseName = seq.name.replace(/ \(copy \d*\)/, "");
    // TODO: This function has string typing, regexes and inband signalling.
    // I like to avoid all of those. Possible refactor target?
    let copies = _.select(s.all, function (item) {
      return (item.name.indexOf(baseName) !== -1);
    }).length;
    // Give it a name with the (copy X) stripped out
    seq.name = baseName;
    // Add the (copy X) back
    seq.name += ` (copy ${copies})`;
    s.current = s.all.length;
    s.all.push(seq);
    maybeAddMarkers(s);
    return s;
  })
  .add<MoveStepPayl>("MOVE_STEP", function (s, a) {
    let { from, to } = a.payload;
    markDirty(s);
    s.all[s.current].body = move<Step>((s.all[s.current].body || []),
      a.payload.from,
      a.payload.to) as SequenceBodyItem[];
    if (from < to) {
      // EDGE CASE: If you drag a step upwards, it will end up in the
      // wrong slot. As a fix, I swap the "to" index with the item below
      // it an vice versa.
      // I KNOW THERE ARE SHORTER WAYS TO SWAP AN ARRAY.
      // DO NOT OPTOMIZE. INTENTIONALLY LENGTHENED FOR CLARITY.
      let list = (s.all[s.current].body || []);
      let topIndex = to;
      let bottomIndex = to - 1;
      let top = list[topIndex];
      let bottom = list[bottomIndex];
      list[topIndex] = bottom;
      list[bottomIndex] = top;
    }
    maybeAddMarkers(s);
    return s;
  })
  .add<SpliceStepPayl>("SPLICE_STEP", function (s, a) {
    markDirty(s);
    let body = s.all[s.current].body || [];
    let step = a.payload.step as SequenceBodyItem;
    body.splice(a.payload.insertBefore, 0, step);
    maybeAddMarkers(s);
    return s;
  });

function markDirty(s: SequenceReducerState) {
  s.all[s.current].dirty = true;
};

/** HACK: TODO: If we were to iterate over sequence.body (using map()) and we
 * wrote `key={inx}` inside the iterator, React's diff algorithm would loose
 * track of which step has changed (and sometimes even mix up the state of
 * completely different steps). To get around this, we add a `uuid` property to
 * Steps that is guaranteed to be unique and allows React to diff the list
 * correctly. Let's refactor this out.
 */
function maybeAddMarkers(s: SequenceReducerState) {
  s.all.map(function (seq) {
    (seq.body || []).map(function (step) {
      (step as any).uuid = (step as any).uuid || uuid();
    });
  });
};
