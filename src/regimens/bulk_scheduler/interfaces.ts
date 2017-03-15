import { RegimenItem } from "../interfaces";
import { Sequence } from "../../sequences/interfaces";

export interface BulkSchedulerOutput {
  index: number;
  regimenItems: RegimenItem[];
}

export interface BulkSchedulerState {
  sequence?: Sequence;
  form: BulkScheduleForm;
}

export interface BulkEditorProps {
  sequences: Sequence[];
  editor: BulkSchedulerState;
  dispatch: Function;
}

export interface BulkScheduleForm {
  /** Time in ms to offset each action at the start of the day. */
  dailyOffsetMs: number;
  weeks: Week[];
}

export interface Week {
  days: {
    day1: boolean;
    day2: boolean;
    day3: boolean;
    day4: boolean;
    day5: boolean;
    day6: boolean;
    day7: boolean;
  };
}

export interface SetTimeOffsetProps {
  hours: number;
  minutes: number;
}

export interface ToggleDayParams {
  week: number;
  day: number;
}

export interface AddButtonProps {
  active: boolean;
  click: React.EventHandler<React.FormEvent<{}>>;
}

export interface SequenceListProps {
  sequences: Sequence[];
  current: Sequence;
  dispatch: Function;
}

export interface TimeInputProps {
  dispatch: Function;
  /** milliseconds from midnight */
  offset: number;
}

export interface TimeInputState {
  val: string;
}

export interface WeekGridProps {
  weeks: Week[];
  dispatch: Function;
};

export interface WeekRowProps {
  week: Week;
  index: number;
  dispatch: Function;
}

export interface DayProps {
  day: number;
  week: number;
  dispatch: Function;
  id: string;
  active: boolean;
}

