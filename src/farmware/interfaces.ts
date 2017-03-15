import { BotState } from "../devices/interfaces";

export interface FWState {
  selectedFarmware: string | undefined;
  packageUrl: string | undefined;
}

export interface FWProps {
  bot: BotState;
}
