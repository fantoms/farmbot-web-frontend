import { AuthState } from "../auth/interfaces";

export interface Props {
  auth: AuthState | undefined;
  dispatch: Function;
  saveUser: (data: State, dispatch: Function) => void;
  enactDeletion: (deletion_confirmation: string | undefined,
    dispatch: Function) => void;
}

/** JSON form that gets POSTed to the API when user updates their info. */
export interface State {
  name?: string;
  email?: string;
  password?: string;
  new_password?: string;
  new_password_confirmation?: string;
  /** User must enter password confirmation to delete their account. */
  deletion_confirmation?: string;
}

export interface DeletionRequest {
  password: string;
}

export interface DeleteAccountPropTypes {
  deletion_confirmation: string | undefined;
  set: React.EventHandler<React.FormEvent<HTMLInputElement>>;
  save: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}

export interface ChangePwPropTypes {
  password: string | undefined;
  new_password: string | undefined;
  new_password_confirmation: string | undefined;
  set: React.EventHandler<React.FormEvent<HTMLInputElement>>;
  save: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}

export interface SettingsPropTypes {
  name: string;
  email: string;
  set: React.EventHandler<React.FormEvent<HTMLInputElement>>;
  save: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}
