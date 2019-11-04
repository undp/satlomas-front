import React from "react";
import { Image } from "react-konva";

class AnnotationImage extends React.Component {
  state = {
    image: null
  };

  componentDidMount() {
    const { src } = this.props;

    const image = new window.Image();
    image.src = src;
    image.onload = () => {
      this.setState({
        image
      });
    };
  }

  handleMouseMove = e => {
    const container = e.target.getStage().container();
    container.style.cursor = "crosshair";
  };

  render() {
    const { image } = this.state;
    const { width, height } = this.props;

    return (
      <Image
        ref={node => (this.image = node)}
        onMouseMove={this.handleMouseMove}
        width={width}
        height={height}
        image={image}
      />
    );
  }
}

export default AnnotationImage;
