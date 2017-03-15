import { ReduxAction } from "../redux/interfaces";
import { Sequence } from "../sequences/interfaces";
import { Color, Everything } from "../interfaces";

export interface RegimenPropsWithParams extends Everything {
  params: { regimen: string; };
}

/** RegimenItem, as presented by the REST API */
export interface ApiRegimenItem {
  id?: number;
  regimen_id?: number;
  time_offset: number;
  sequence_id: number;
};

/** Regimen, as presented by the REST API */
export interface ApiRegimen {
  name: string;
  color: Color;
  regimen_items: ApiRegimenItem[];
};

/** Used by UI widgets that modify a regimen */
export interface RegimenProps {
  regimen?: Regimen;
  dispatch: Function;
};

/** A list of "sequences" scheduled after a starting point (epoch). */
export interface Regimen {
  id?: number;
  /** Friendly identifier for humans to easily identify regimens. */
  name: string;
  color: Color;
  regimen_items: RegimenItem[];
  dirty?: boolean;
};

/** Individual step that a regimen will execute at a point in time. */
export interface RegimenItem {
  id?: number;
  regimen_id?: number;
  sequence: Sequence;
  /** Time (in milliseconds) to wait before executing the sequence */
  time_offset: number;
};

/** How Regimen state is stored in the application. 
 * Used by Regimen reducer mostly */
export interface RegimensState {
  current: number;
  all: Regimen[];
}

/** Used by regimen reducer to route incoming stream of Redux actions */
export interface RegimensActionHandler {
  [actionName: string]: (state: RegimensState,
    action: ReduxAction<any>) => RegimensState;
}

export interface AddRegimenProps {
  dispatch: Function;
  className?: string;
  children?: JSX.Element;
}

export interface RegimenListItemProps extends RegimenProps {
  index: number;
}
