import * as React from "react";

interface State {
  isDragging: boolean;
  mouseX: number;
  mouseY: number;
  radius: number;
}

interface Props {
  id: number;
  height: number;
  width: number;
  onUpdate: (deltaX: number, deltaY: number, idx: number) => void;
  onDrop: (id: number) => void;
  x: number;
  y: number;
  href: string;
}

// THANK YOU!
// https://github.com/winkerVSbecks/fermat-point/blob/master/src/handle.jsx
export class DraggableSvgImage extends React.Component<Props, Partial<State>> {

  constructor() {
    super();
    this.hover = this.hover.bind(this);
    this.selectElement = this.selectElement.bind(this);
    this.deSelectElement = this.deSelectElement.bind(this);
    this.state = {
      isDragging: false,
      radius: 5
    };
  }

  hover() {
    this.setState({
      radius: 30
    });
  }

  selectElement(e: React.MouseEvent<SVGElement>) {
    this.setState({
      isDragging: true,
      mouseX: e.pageX,
      mouseY: e.pageY
    });
  }

  deSelectElement(e: React.MouseEvent<SVGElement>) {
    if (this.state.isDragging) {
      this.props.onDrop(this.props.id);
    }
    this.setState({
      isDragging: false,
      radius: 5
    });
  }

  drag(e: React.MouseEvent<SVGElement>) {

    if (this.state.isDragging) {
      let idx = this.props.id;
      let deltaX = e.pageX - this.state.mouseX;
      let deltaY = e.pageY - this.state.mouseY;

      this.props.onUpdate(deltaX, deltaY, idx);

      this.setState({
        mouseX: e.pageX,
        mouseY: e.pageY
      });
    }
  }

  render() {
    return (
      <image className="handle"
        id={this.props.id.toString()}
        x={this.props.x}
        y={this.props.y}
        href={this.props.href}
        height={this.props.height}
        width={this.props.width}
        onMouseOver={() => this.hover()}
        onMouseDown={(e) => this.selectElement(e)}
        onMouseMove={(e) => this.drag(e)}
        onMouseUp={(e) => this.deSelectElement(e)}
        onMouseLeave={(e) => this.deSelectElement(e)} />
    );
  }
};
