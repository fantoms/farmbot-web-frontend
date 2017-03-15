import * as React from "react";
import { Everything } from "./interfaces";
import { ConfigState } from "./config/interfaces";
import { BotState } from "./devices/interfaces";
import { PeripheralState } from "./controls/peripherals/interfaces";
import { ToolsState } from "./tools/interfaces";
import { Log } from "./interfaces";
import { FarmEvent } from "./farm_designer/interfaces";

export class Wrapper extends React.Component<any, any> {
  render() {
    return <div> {this.props.children} </div>;
  }
}

/** Factory function for empty state object. */
export function fakeState(dispatcher?: Function): Everything {
  let query = {} as { [name: string]: string };
  let sequences = {
    all: [],
    current: 0
  };
  let location = {
    pathname: "/testsuite",
    search: "?foo=bar",
    hash: "??????",
    action: "PUSH",
    key: "jhedoi",
    query
  };

  let auth = undefined;

  let designer = {
    x_size: 200,
    y_size: 200,
    deprecatedPlants: [],
    cropSearchQuery: "?foo=bar",
    cropSearchResults: []
  };
  let bot: BotState = {
    account: {
      id: 1,
      name: "wow"
    },
    status: "???",
    dirty: false,
    /** How many steps to move when the user presses a manual movement arrow */
    stepSize: 100,
    /** Holds settings that the user is currently editing, but has not sent */
    settingsBuffer: {
      movement_max_spd_x: "0",
      movement_max_spd_y: "0",
      movement_max_spd_z: "0",
      movement_steps_acc_dec_x: "0",
      movement_steps_acc_dec_y: "0",
      movement_steps_acc_dec_z: "0",
      movement_timeout_x: "0",
      movement_timeout_y: "0",
      movement_timeout_z: "0",
    },
    configBuffer: {
      os_auto_update: false,
      fw_auto_update: true
    },
    hardware: {
      mcu_params: {},
      informational_settings: {},
      configuration: {},
      location: [-1, -1, -1],
      pins: {},
      user_env: {},
      process_info: {
        farmwares: [],
        regimens: [],
        farm_events: []
      }
    },
  };

  let regimens = {
    current: 0,
    all: []
  };

  let bulkScheduler = {
    currentRegimen: 0,
    form: {
      dailyOffsetMs: 1,
      weeks: []
    }
  };
  let dispatch = dispatcher || function () { };
  let config: ConfigState = {
    host: "localhost",
    port: "5555"
  };

  let peripherals: PeripheralState = {
    editorMode: "controlling",
    all: []
  };

  let sync = {
    loaded: false,
    api_version: "",
    compat_num: 0,
    device: {
      id: 0,
      name: "",
      webcam_url: "",
      dirty: false
    },
    users: [],
    sequences: [],
    regimens: [],
    peripherals: [],
    regimen_items: [],
    tool_bays: [],
    tool_slots: [],
    tools: [],
    plants: [],
    logs: [],
    images: [],
    points: [],
    farm_events: []
  };

  let draggable = { dataTransfer: {} };

  let tools: ToolsState = {
    editorMode: false,
    tool_bays: [
      {
        name: "toolbay 1",
        id: 1234,
      }
    ],
    tool_slots: [
      {
        id: 333,
        tool_bay_id: 1234,
        created_at: "SOME UTC STRING",
        tool_id: 1,
        x: 10,
        y: 20,
        z: 30
      },
    ],
    tools: {
      isEditing: false,
      all: [{
        id: 1,
        name: "tool1"
      }],
      dirty: false
    }
  };

  let images = { all: [] };

  let router = { push: function () { } };

  return {
    location
    , auth
    , designer
    , dispatch
    , bot
    , sequences
    , regimens
    , bulkScheduler
    , config
    , draggable
    , peripherals
    , sync
    , tools
    , images
    , router
  };
}
