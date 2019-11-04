import Fab from "@material-ui/core/Fab";
import ClearIcon from "@material-ui/icons/Clear";
import React from "react";

class DeleteRectangleFab extends React.Component {
  render() {
    const { shape, stroke, onClick } = this.props;

    const shapeWidth = shape.widthAfterResize || shape.width;
    const shapeHeight = shape.heightAfterResize || shape.height;

    const center = {
      x: shape.x + shapeWidth / 2 - 20,
      y: shape.y + shapeHeight / 2 - 20
    };

    return (
      <Fab
        size="small"
        color="secondary"
        aria-label="Remove"
        onClick={onClick}
        style={{
          position: "absolute",
          backgroundColor: `${stroke}80`,
          top: center.y,
          left: center.x
        }}
      >
        <ClearIcon />
      </Fab>
    );
  }
}

export default DeleteRectangleFab;
