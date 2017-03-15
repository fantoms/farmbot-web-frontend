import { DropAreaProps, DropAreaState } from "./interfaces";
import * as React from "react";

/** Style rules for the drop area when it is not dragged over. */
const INVISIBLE_STYLE = {
  width: "100%",
  height: "3px",
  zIndex: 10,
  position: "relative"
};

export class DropArea extends React.Component<DropAreaProps, DropAreaState> {
  constructor() {
    super();
    this.state = { isHovered: false };
  }

  dragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  }

  drop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    let key = event.dataTransfer.getData("text");
    let fn = this.props.callback;
    if (fn) { fn(key); }
    this.toggle();
  }

  toggle = () => {
    this.setState({ isHovered: !this.state.isHovered });
  }

  visible() {
    return <div className="drag-drop-area padding"
      onDragOver={this.dragOver}
      onDrop={this.drop}>
      {this.props.children}
    </div>;
  }

  hidden() {
    return <div style={INVISIBLE_STYLE}></div>;
  }

  render() {
    let isVisible = this.props.isLocked || this.state.isHovered;

    return <div onDragLeave={this.toggle}
      onDragEnter={this.toggle}>
      {isVisible ? this.visible() : this.hidden()}
    </div>;
  }
}
