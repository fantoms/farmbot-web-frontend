export type EditorMode = "editing" | "controlling";

export interface PeripheralState {
  editorMode: EditorMode;
  all: Peripheral[];
}

export interface Peripheral {
  id?: number;
  dirty?: boolean;
  mode?: number;
  pin: number;
  label: string;
}

/** A combination of a peripheral object,
 * plus its index within state.peripheral.all */
export interface IndexedPeripheral {
  index: number;
  peripheral: Peripheral;
}

export interface PeripheralFormProps {
  dispatch: Function;
  editorMode: EditorMode;
}

export interface UpdatePeripheral {
  index: number;
  peripheral: {
    // Typescript 2.1 will introduce subset types.
    // TODO: Change this to a subset type when that feature lands.
    label?: string;
    pin?: number;
  };
}
