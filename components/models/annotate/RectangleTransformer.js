import React from "react";
import { Transformer } from "react-konva";

class RectangleTransformer extends React.Component {
  componentDidMount() {
    this.checkNode();
  }

  componentDidUpdate() {
    this.checkNode();
  }

  checkNode() {
    // Here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;

    const selectedNode = stage.findOne("." + selectedShapeName);
    // Do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      // Attach to another node
      this.transformer.attachTo(selectedNode);
    } else {
      // Remove transformer
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }

  boundBoxFunc = (oldBox, newBox) => {
    const { minRectSize, imageWidth, imageHeight } = this.props;

    // Minimum bounding box size
    if (minRectSize) {
      if (Math.abs(newBox.width) < minRectSize) {
        newBox.width = newBox.width < 0 ? -minRectSize : minRectSize;
      }
      if (Math.abs(newBox.height) < minRectSize) {
        newBox.height = newBox.height < 0 ? -minRectSize : minRectSize;
      }
    }

    // Limit rectangle inside AnnotationImage
    if (imageWidth && newBox.x + newBox.width > imageWidth) {
      newBox.width = imageWidth - newBox.x;
    }
    if (imageHeight && newBox.y + newBox.height > imageHeight) {
      newBox.height = imageHeight - newBox.y;
    }
    return newBox;
  };

  render() {
    const { selectedShape, fill, stroke, onTransform } = this.props;

    return (
      <Transformer
        ref={node => (this.transformer = node)}
        rotateEnabled={false}
        keepRatio={false}
        ignoreStroke={true}
        anchorCornerRadius={3}
        anchorStrokeWidth={2}
        anchorStroke={selectedShape && stroke}
        anchorFill={selectedShape && fill}
        borderStroke={selectedShape && stroke}
        borderStrokeWidth={2}
        onTransform={onTransform}
        boundBoxFunc={this.boundBoxFunc}
      />
    );
  }
}

export default RectangleTransformer;
