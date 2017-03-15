import { Everything } from "../interfaces";
import { updateUser, deleteUser } from "./actions";
import { Props, State } from "./interfaces";

export function mapStateToProps(props: Everything): Props {
  let auth = props.auth;

  let saveUser = (data: State, dispatch: Function) => {
    dispatch(updateUser(data));
  };

  // Hear ye, hear ye!
  let enactDeletion = (deletion_confirmation: string, dispatch: Function) => {
    let password = deletion_confirmation || "NEVER SET";
    dispatch(deleteUser({ password }));
  };

  return {
    auth,
    saveUser,
    enactDeletion,
    dispatch: Function
  };
}

