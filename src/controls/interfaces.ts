import { BotState } from "../devices/interfaces";
import { PeripheralState } from "./peripherals/interfaces";

export interface ControlsState {
  isEditingCameraURL: boolean;
}

export interface DirectionButtonProps {
  axis: "x" | "y" | "z";
  direction: "up" | "down" | "left" | "right";
  steps: number;
}

export interface ToggleState {
  /** Function that is executed when the toggle button is clicked */
  toggleAction: () => void;
  toggleval: number | string | undefined;
}

export interface SaveWebcamParams {
  dispatch: Function;
  apiUrl: string;
  webcam_url: string;
  updateState: Function;
}

export interface WebcamSaveBtnProps {
  dispatch: Function;
  webcamUrl: string;
  apiUrl: string;
  updateState: Function;
}

export interface Vector {
  x: number;
  y: number;
  z: number;
}

export interface Props {
  onCommit: (v: Vector) => void;
  bot: BotState;
}

export interface State {
  x?: number | undefined;
  y?: number | undefined;
  z?: number | undefined;
}

export interface AxisInputBoxProps {
  axis: "x" | "y" | "z";
  label: string;
  value: number | undefined;
  onChange: (key: string, val: number | undefined) => void;
}

export interface AxisInputBoxState {
  value: string | undefined;
}

export interface StepSizeSelectorProps {
  choices: number[];
  selected: number;
  selector: (num: number) => void;
}

export interface TitleBarProps extends PeripheralState {
  dispatch: Function;
}

export interface JogMovementControlsProps {
  bot: BotState;
}

export interface ToggleButtonProps {
  /** Function that is executed when the toggle button is clicked */
  toggleAction: () => void;
  toggleval: number | string | undefined;
}


