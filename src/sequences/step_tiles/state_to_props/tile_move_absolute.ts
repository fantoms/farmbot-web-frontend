import { Everything } from "../../../interfaces";
import { Dictionary, MoveAbsolute as Step } from "farmbot/dist";
import { DropDownItem } from "../../../ui/fb_select";
import { Tool, ToolSlot } from "../../../tools/interfaces";
import { changeMoveAbsStepSelect, changeMoveAbsStepValue } from "../../actions";
import { safeStringFetch } from "../../../util";

export interface TileMoveAbsoluteProps {
  options: DropDownItem[];
  dispatch: Function;
  compute(kind: string, arg: string, step: Step): string;
  toolById: Dictionary<Tool | undefined>;
  slotByToolId: Dictionary<ToolSlot | undefined>;
  changeToolSelect(step: Step,
    index: number,
    dispatch: Function,
    tool: DropDownItem): void;
  changeInputValue(value: string,
    type: string,
    index: number,
    dispatch: Function): void;
}

export function mapStateToProps(props: Everything): TileMoveAbsoluteProps {

  /** Get data indexed */
  let toolById: Dictionary<Tool | undefined> =
    _.indexBy(props.tools.tools.all, "id");
  let slotByToolId: Dictionary<ToolSlot | undefined> =
    _.indexBy(props.tools.tool_slots, "tool_id");

  /** Create dropdown options */
  // tools WHERE slot_id NOT NULL
  let options = props
    .tools
    .tool_slots
    .filter(slot => slot && slot.tool_id && slot.id)
    .map(slot => ({ slot, tool: toolById[slot.tool_id || 0] }))
    .filter(pair => (pair.slot && pair.tool))
    .map(function (both: { tool: Tool, slot: ToolSlot }): DropDownItem {
      let { tool } = both;
      let { name, id } = tool;
      return { label: name, value: (id as number) };
    });

  /** Fires when a DropDownItem is selected */
  let changeToolSelect = (step: Step,
    index: number,
    dispatch: Function,
    tool: DropDownItem) => {
    dispatch(changeMoveAbsStepSelect(index, tool, step));
  };

  /** Used to compute the values of the input boxes */
  function compute(kind: string, arg: string, step: Step) {
    switch (kind) {
      case "location":
        return safeStringFetch(step.args.location.args, arg);
      case "offset":
        return safeStringFetch(step.args.offset.args, arg);
      default:
        throw new Error("Something went wrong with input value compute fn.");
    }
  };

  /** Fires whenever a BlurableInput field is blurred */
  let changeInputValue = (value: string,
    kind: string,
    index: number,
    dispatch: Function) => {
    dispatch(changeMoveAbsStepValue(value, kind, index));
  };

  return {
    options,
    compute,
    changeToolSelect,
    changeInputValue,
    toolById,
    slotByToolId,
    dispatch() { }
  };

}
