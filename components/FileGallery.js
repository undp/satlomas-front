import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withNamespaces } from "../i18n";
import classNames from "classnames";

const styles = theme => ({
  selectedGalleryFile: {
    opacity: "0.5",
    border: "1px solid black"
  },
  galleryFile: {
    height: "96%",
    cursor: "pointer",
    display: "inline",
    marginRight: "2px"
  },
  gallery:{
    height: "112px",
    overflow: "auto",
    whiteSpace: "nowrap",
    marginBottom: "10px"
  },
});

class FileGallery extends Component {
  constructor(props) {
    super(props);
  }

  createImage(item){
    const { classes } = this.props;
    return (
      <img className={classes.galleryFile} 
        key={item.name}
        src={item.src} 
        alt={item.name}
        onClick = {() => this.handleFileClick(item)}
      />)
  }

  createSelectedImage(item){
    const { classes } = this.props;
    return (
      <img className={classNames(classes.galleryFile,classes.selectedGalleryFile)}
        key={item.name}
        src={item.src} 
        alt={item.name}
        onClick = {() => this.handleFileClick(item)}
    />)
  }

  createGallery(){
    const { files } = this.props;
    return files.map((item, key) => {
        if(item['selected']) return this.createSelectedImage(item);
        else return this.createImage(item);
    });
  }

  handleFileClick(elem){
    this.props.onFileClick(elem['name']);
  }


  render() {
    const { classes } = this.props;
    const { loaded } = this.props;

    return (
        loaded &&
        <div className={classes.gallery}>
          {this.createGallery()}
        </div>
    );
  }
}

FileGallery.defaultProps = {
  loaded: false,
  files: [],
  onFileClick: () => {}
};

FileGallery.propTypes = {
  loaded: PropTypes.bool,
  files: PropTypes.array,
  onFileClick: PropTypes.func
};

FileGallery = withStyles(styles)(FileGallery);
FileGallery = withNamespaces("models")(FileGallery);

export default FileGallery;
