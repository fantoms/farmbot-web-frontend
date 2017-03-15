import * as React from "react";

interface BIProps {
  value: string;
  onCommit(e: React.SyntheticEvent<HTMLInputElement>): void;
  min?: number;
  max?: number;
  type?: "text" | "number" | "email" | "password" | "time" | "date";
  name?: string;
  id?: string;
  /** Allow the user to empty out the form control. If unset, form control
   * will reset itself to previous value. */
  allowEmpty?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

interface BIState {
  buffer?: string;
  isEditing?: boolean;
}

export class BlurableInput extends React.Component<BIProps, BIState> {
  constructor(props: BIProps) {
    super();
    this.state = { buffer: "", isEditing: false };
  }

  maybeCommit(e: React.SyntheticEvent<HTMLInputElement>) {
    let shouldCommit = (
      this.state.buffer || (this.props.allowEmpty && _.isString(""))
    );
    if (shouldCommit) { this.props.onCommit(e); }
    this.setState({ isEditing: false, buffer: "" });
  }

  focus() {
    this.setState({ isEditing: true, buffer: this.props.value });
  }

  updateBuffer(e: React.SyntheticEvent<HTMLInputElement>) {
    let buffer = e.currentTarget.value;
    this.setState({ buffer });
  }

  render() {
    let value = this.state.isEditing ? this.state.buffer : this.props.value;
    return <input value={value}
      onFocus={this.focus.bind(this)}
      onChange={this.updateBuffer.bind(this)}
      onBlur={this.maybeCommit.bind(this)}
      name={this.props.name}
      id={this.props.id}
      min={this.props.min}
      max={this.props.max}
      type={this.props.type || "text"}
      disabled={this.props.disabled}
      className={this.props.className}
      placeholder={this.props.placeholder} />;
  }
}
