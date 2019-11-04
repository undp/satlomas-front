import React from "react";
import { Rect, Text } from "react-konva";

class Rectangle extends React.Component {
  state = {
    hover: false
  };

  handleMouseEnter = e => {
    this.setState({ hover: true });
  };

  handleMouseLeave = e => {
    this.setState({ hover: false });
  };

  componentDidUpdate() {
    const { hover } = this.state;
    const { selected } = this.props;

    const container = this.rect.getStage().container();

    if (hover) {
      if (selected) {
        container.style.cursor = "move";
      } else {
        container.style.cursor = "pointer";
      }
    }
  }

  render() {
    const {
      x,
      y,
      width,
      height,
      widthAfterResize,
      heightAfterResize,
      label,
      name,
      stroke,
      fill,
      selected,
      onDragMove
    } = this.props;

    const textPadding = 5;
    const realWidth = widthAfterResize || width;
    const realHeight = heightAfterResize || height;
    const textX = (realWidth < 0 ? x + realWidth : x) || 0;
    const textY = (realHeight < 0 ? y + realHeight : y) || 0;

    return (
      <React.Fragment>
        <Rect
          ref={node => (this.rect = node)}
          x={x}
          y={y}
          width={width}
          height={height}
          stroke={stroke}
          strokeWidth={selected ? 0 : 2}
          fill={fill}
          name={name}
          draggable
          onDragMove={onDragMove}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        <Text
          x={textPadding + textX}
          y={textPadding + textY}
          name={name}
          text={label}
          fill="#ffffff"
          fontVariant="small-caps"
        />
      </React.Fragment>
    );
  }
}

export default Rectangle;
