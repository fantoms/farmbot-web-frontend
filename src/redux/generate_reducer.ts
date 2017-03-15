import { ReduxAction } from "./interfaces";
import { defensiveClone } from "../util";

const NOOP = (s: any, a: ReduxAction<{}>) => s;

export function generateReducer<State>(
  initialState: State,
  /** Set "catch all" handler for unknown action names. Default is a no-op fn.
   *  Useful for logging / debugging. */
  DEFAULT = NOOP) {
  /** A function that responds to a particular action from within a 
   * generated reducer. */
  interface ActionHandler {
    (state: State, action: ReduxAction<any>): State;
  }

  interface GenericActionHandler<T> {
    (state: State, action: ReduxAction<T>): State;
  }

  interface ActionHandlerDict {
    [actionHandler: string]: ActionHandler;
    DEFAULT: ActionHandler;
  }

  interface GeneratedReducer extends ActionHandler {
    /** Adds action handler for current reducer. */
    add: <T>(name: string,
      fn: GenericActionHandler<T>) => GeneratedReducer;
    // Calms the type checker.
  }

  let actionHandlers: ActionHandlerDict = {
    // Reset to initialState if action is LOGOUT
    "LOGOUT": function (s, a) {
      return initialState;
    },
    DEFAULT
  };

  let reducer: GeneratedReducer = function <T>(state = initialState,
    action: ReduxAction<T>): State {
    let handler = (actionHandlers[action.type] ||
      actionHandlers["DEFAULT"]);

    let clonedState = defensiveClone<State>(state);
    let clonedAction = defensiveClone<ReduxAction<T>>(action);

    let result: State = handler(clonedState, clonedAction);
    return result;
  } as GeneratedReducer;

  reducer.add = function addHandler<T>(name: string,
    fn: GenericActionHandler<T>) {
    actionHandlers[name] = fn;
    return reducer;
  };

  return reducer;
}
