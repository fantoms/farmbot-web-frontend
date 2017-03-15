import { Regimen, RegimenItem, RegimenProps, RegimensState } from "../interfaces";
import { AuthState } from "../../auth/interfaces";
import { BotState } from "../../devices/interfaces";

export interface ActiveEditorProps {
  regimen: Regimen;
  dispatch: Function;
}

export interface RegimenItemListProps {
  items: RegimenItem[];
  dispatch: Function;
}

export interface RegimenItemStepProps {
  item: RegimenItem;
  dispatch: Function;
}

export interface RegimenItemDayGroupProps {
  day: string;
  items: RegimenItem[];
  dispatch: Function;
}

export interface SaveButtonProps extends RegimenProps {
  url: string;
};

export interface RegimenEditorWidgetProps {
  regimens: RegimensState;
  dispatch: Function;
  auth: AuthState | undefined;
  bot: BotState;
}

export interface CopyButtnProps {
  dispatch: Function;
  regimen?: Regimen;
}

export interface DeleteButtonProps extends RegimenProps {
  baseUrl: string;
};
