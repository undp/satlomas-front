import React from "react";
import PropTypes from "prop-types";
import { Layer, Stage } from "react-konva";
import AnnotationImage from "./AnnotationImage";
import LabelMenu from "./LabelMenu";
import Rectangle from "./Rectangle";
import RectangleTransformer from "./RectangleTransformer";

const MIN_RECT_SIZE = 10;
const RECT_FILL = "#0080ff40";
const RECT_STROKE = "#0080ff";
const LABEL_COLORS = [
  "#e6194B",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabebe",
  "#469990",
  "#e6beff",
  "#9A6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#a9a9a9",
  "#ffffff",
  "#000000"
];

class AnnotatedImageTile extends React.Component {
  state = {
    mouseDraw: false,
    rectCount: 0,
    rectangles: {},
    selectedShapeName: "",
    showLabelMenu: false,
    mouseX: 0,
    mouseY: 0
  };

  handleStageMouseDown = e => {
    // Clicked on stage - clear selection
    if (e.evt.button === 0 && e.target.className === "Image") {
      const stage = e.target.getStage();
      const mousePos = stage.getPointerPosition();
      const newRect = {
        x: mousePos.x,
        y: mousePos.y,
        width: 0,
        height: 0
      };
      this.setState({
        mouseDown: true,
        newRect: newRect,
        selectedShapeName: ""
      });
      return;
    }

    // Clicked on transformer - do nothing
    const parent = e.target.getParent();
    const clickedOnTransformer = parent && parent.className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }

    const targetisRectangle =
      e.target.className === "Rect" || e.target.className === "Text";

    if (targetisRectangle) {
      // Find clicked rect by its name
      const name = e.target.name();
      const rect = this.props.rectangles[name];
      if (rect) {
        this.setState({
          selectedShapeName: name
        });
      } else {
        this.setState({
          selectedShapeName: ""
        });
      }

      if (e.evt.button === 2) {
        // Show label menu (context menu)
        const mouseX = e.evt.clientX;
        const mouseY = e.evt.clientY;
        this.setState({ mouseX, mouseY, showLabelMenu: true });
      }
    }
  };

  handleStageMouseMove = e => {
    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();

    // Update new rectangle, if drawing any
    let { newRect } = this.state;
    if (newRect) {
      newRect.width = mousePos.x - newRect.x;
      newRect.height = mousePos.y - newRect.y;
      this.setState({ newRect, mouseDraw: true });
    }

    const mouseX = e.evt.clientX;
    const mouseY = e.evt.clientY;
    this.setState({ mouseX, mouseY });
  };

  isNewRectValid() {
    const { newRect } = this.state;

    return (
      newRect &&
      Math.abs(newRect.width) >= MIN_RECT_SIZE &&
      Math.abs(newRect.height) >= MIN_RECT_SIZE
    );
  }

  handleStageMouseUp = () => {
    const { newRect, mouseDraw } = this.state;
    const { labels } = this.props;

    // If rect is too small, enlarge it to minimum size
    if (mouseDraw && !this.isNewRectValid()) {
      newRect.width = newRect.width < 0 ? -MIN_RECT_SIZE : MIN_RECT_SIZE;
      newRect.height = newRect.height < 0 ? -MIN_RECT_SIZE : MIN_RECT_SIZE;
      this.setState({ newRect });
    }

    if (mouseDraw) {
      if (this.isNewRectValid()) {
        if (labels.length > 1) {
          this.setState({ showLabelMenu: true });
        } else {
          this.addNewRectangle(newRect, labels[0]);
        }
      } else {
        this.setState({ newRect: null });
      }
    }

    this.setState({ mouseDown: false });
  };

  triggerOnChange(rectangles) {
    const { id, onChange } = this.props;
    onChange(id, rectangles);
  }

  triggerOnNew(rectangle) {
    const { id, onNew } = this.props;
    if (onNew) onNew(id, rectangle);
  }

  triggerOnDelete(rectangle) {
    const { id, onDelete } = this.props;
    if (onDelete) onDelete(id, rectangle);
  }

  handleDelete = e => {
    const { rectangles } = this.props;
    const { selectedShapeName } = this.state;

    // If there is no shape selected, do nothing
    if (!selectedShapeName) return;

    const { [selectedShapeName]: deletedRect, ...newRectangles } = rectangles;

    this.setState({ showLabelMenu: false });

    this.triggerOnChange(newRectangles);
    this.triggerOnDelete(deletedRect);
  };

  handleRectangleDragMove = e => {
    this.updateSelectedRectangle(rect => {
      rect.x = e.target.x();
      rect.y = e.target.y();
    });
  };

  handleTransform = e => {
    const transformer = e.currentTarget;

    this.updateSelectedRectangle(rect => {
      rect.x = transformer.getX();
      rect.y = transformer.getY();
      // Workaround for Transformer bug when resizing with top-left handlers:
      // Store new width and height in different variables.
      rect.widthAfterResize = transformer.getWidth();
      rect.heightAfterResize = transformer.getHeight();
    });
  };

  handleLabelMenuClose = () => {
    this.setState({ newRect: null, showLabelMenu: false });
  };

  handleLabelMenuItemClick = label => {
    const { mouseDraw } = this.state;

    if (mouseDraw) {
      const { newRect } = this.state;
      this.addNewRectangle(newRect, label);
    } else {
      this.setState({
        mouseDraw: false,
        showLabelMenu: false
      });

      const { rectangles } = this.props;
      const { selectedShapeName } = this.state;

      rectangles[selectedShapeName].label = label;
      this.triggerOnChange(rectangles);
    }
  };

  addNewRectangle(rect, label) {
    const { rectangles } = this.props;

    const newRectName = String(Object.keys(rectangles).length);
    const newRect = {
      ...rect,
      name: newRectName,
      label: label
    };
    const newRectangles = {
      ...rectangles,
      [newRectName]: newRect
    };

    this.setState({
      mouseDraw: false,
      showLabelMenu: false,
      selectedShapeName: newRectName
    });

    this.triggerOnChange(newRectangles);
    this.triggerOnNew(newRect);
  }

  updateSelectedRectangle(cb) {
    const { rectangles } = this.props;
    const { selectedShapeName } = this.state;

    const selectedShape = rectangles[selectedShapeName];
    if (selectedShape) cb(selectedShape);

    this.triggerOnChange(rectangles);
  }

  getRectangleColors(rectangle) {
    if (!rectangle) return {};

    const { label } = rectangle;
    const { labels } = this.props;

    const labelIndex = labels.indexOf(label);
    const labelColor = LABEL_COLORS[labelIndex % LABEL_COLORS.length];

    return {
      fill: `${labelColor}30`,
      stroke: labelColor
    };
  }

  render() {
    const {
      src,
      width,
      height,
      rectangles,
      labels,
      style,
      className
    } = this.props;

    const {
      showLabelMenu,
      selectedShapeName,
      newRect,
      mouseDraw,
      mouseDown,
      mouseX,
      mouseY
    } = this.state;

    const selectedShape = rectangles && rectangles[selectedShapeName];

    return (
      <div
        style={{ position: "relative", ...style }}
        className={className}
        onContextMenu={e => e.preventDefault()}
      >
        <Stage
          width={width}
          height={height}
          onMouseDown={this.handleStageMouseDown}
          onMouseUp={mouseDown && this.handleStageMouseUp}
          onMouseMove={mouseDown && this.handleStageMouseMove}
        >
          <Layer>
            <AnnotationImage src={src} width={width} height={height} />
          </Layer>
          <Layer>
            {Object.entries(rectangles).map(([name, rect]) => (
              <Rectangle
                key={name}
                onDragMove={this.handleRectangleDragMove}
                selected={name === selectedShapeName}
                {...rect}
                {...this.getRectangleColors(rect)}
              />
            ))}
            {mouseDraw && (
              <Rectangle {...newRect} fill={RECT_FILL} stroke={RECT_STROKE} />
            )}
            <RectangleTransformer
              selectedShapeName={selectedShapeName}
              selectedShape={selectedShape}
              onTransform={this.handleTransform}
              imageWidth={width}
              imageHeight={height}
              minRectSize={MIN_RECT_SIZE}
              {...this.getRectangleColors(selectedShape)}
            />
          </Layer>
        </Stage>
        <LabelMenu
          open={showLabelMenu}
          onClose={this.handleLabelMenuClose}
          onItemClick={this.handleLabelMenuItemClick}
          onDelete={this.handleDelete}
          items={labels}
          left={showLabelMenu ? mouseX : 0}
          top={showLabelMenu ? mouseY : 0}
          editing={!newRect}
        />
      </div>
    );
  }
}

AnnotatedImageTile.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rectangles: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onNew: PropTypes.func,
  onDelete: PropTypes.func
};

export default AnnotatedImageTile;
