import {
  BotStateTree,
  Configuration,
  McuParams
} from "farmbot";
import { ALLOWED_CHANNEL_NAMES, ALLOWED_MESSAGE_TYPES } from "farmbot";
import { AuthState } from "../auth/interfaces";

/** How the device is stored in the API side.
 * This is what comes back from the API as JSON.
 */
export interface DeviceAccountSettings {
  id: number;
  name: string;
  webcam_url?: string;
  /** Must the deivce be saved? */
  dirty?: boolean;
};

/**
 * Rpc Log message from the bot.
 */
export interface RpcBotLog {
  /** The message to be displayed from the bot. */
  message: string;
  /** Unix timestamp of when the log was created. */
  created_at: number;
  /** Array of channels where this message is supposed to show up. */
  channels: ALLOWED_CHANNEL_NAMES[];
  /** Meta data about the message. */
  meta: Meta;
}

/** Meta information about a log message. */
interface Meta {
  type: ALLOWED_MESSAGE_TYPES;
  /** Bot Position X */
  x: number | undefined;
  /** Bot Position Y */
  y: number | undefined;
  /** Bot Position Z */
  z: number | undefined;
}

/** Typescript does not have partial types yet.
 *  When it does, we can pull this out*/
export interface DeviceAccountSettingsUpdate {
  id?: number;
  name?: string;
  uuid?: string;
  webcam_url?: string;
  dirty?: boolean;
};

export interface BotState {
  account: DeviceAccountSettings;
  /** Maximum number of messages to cache. Excess is truncated. */
  status: string;
  /** How many steps to move when the user presses a manual movement arrow */
  stepSize: number;
  /** The current os version on the github release api */
  currentOSVersion?: string;
  /** The current fw version on the github release api */
  currentFWVersion?: string;
  /** Is the bot in sync with the api */
  dirty: boolean;
  /** Holds settings that the user is currently editing, but has not sent */
  settingsBuffer: {
    movement_max_spd_x?: string;
    movement_max_spd_y?: string;
    movement_max_spd_z?: string;
    movement_steps_acc_dec_x?: string;
    movement_steps_acc_dec_y?: string;
    movement_steps_acc_dec_z?: string;
    movement_timeout_x?: string;
    movement_timeout_y?: string;
    movement_timeout_z?: string;
    [name: string]: string | undefined;
  };
  configBuffer: Configuration;
  hardware: HardwareState;
}
export interface BotProp {
  bot: BotState;
}

/** Status registers for the bot's status */
export type HardwareState = BotStateTree;

export interface MqttMessage {
  error?: string | undefined;
  id?: string | undefined;
  result: HardwareState;
}

export interface GithubRelease {
  tag_name: string;
}

type configKey = keyof McuParams;
export interface ChangeSettingsBuffer {
  key: configKey;
  val: number;
}

export interface MoveRelProps {
  x: number;
  y: number;
  z: number;
  speed?: number | undefined;
}

export type Axis = "x" | "y" | "z" | "all";

export interface CalibrationButtonProps {
  axis: Axis;
}

export interface FarmbotOsProps {
  bot: BotState;
  auth: AuthState;
  dispatch: Function;
}

export interface FarmbotOsState {
  cameraStatus: "" | "sending" | "done" | "error";
}

export interface ConfigInputBoxProps {
  bot: BotState;
  setting: string;
  dispatch: Function;
}

export interface McuInputBoxProps {
  bot: BotState;
  setting: string;
  dispatch: Function;
}
