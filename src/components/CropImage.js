import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import * as loadImage from 'blueimp-load-image'


import 'blueimp-canvas-to-blob'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';



class CropImage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      file: this.props.uploadFile.fileSelected,

      src: null,
      crop: {
        height: 100,
        width: 100,
        minWidth:50,
        minHeight:50,
        x: 0,
        y: 0,
        keepSelection: false
      },
    }
  }








  componentDidMount() {

    const file = URL.createObjectURL(this.props.uploadFile.fileSelected);

    //const file = this.props.uploadFile.fileSelected;




    let options = {
      canvas: false,
      pixelRatio: window.devicePixelRatio,
      downsamplingRatio: 0.5,
      orientation: true,
      maxWidth: 700
    }



    loadImage(file, this.updateResults, options);
  }

  updateResults = (canvas) => {
    //document.getElementById('canvas').appendChild(canvas);

    let imgurl = canvas.toDataURL();
    this.setState({
      src: imgurl
    })

    // storageRef.child('images/' + this.props.uploadFile.fileSelected.name).putString(imgurl, 'data_url');
  }




  squareRatio = (crop) => {

    this.setState({
      crop: { ...crop, aspect: 1 }
    })
  }

  onImageLoaded = (image, pixelCrop) => {
    this.imageRef = image;

    // Make the library regenerate aspect crops if loading new images.
    const { crop } = this.state;

    if (crop.aspect && crop.height && crop.width) {
      this.setState({
        crop: { ...crop, height: null },
      });
    } else {
      this.makeClientCrop(crop, pixelCrop);
    }
  };

  onCropComplete = (crop, pixelCrop) => {
    this.makeClientCrop(crop, pixelCrop);
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  async makeClientCrop(crop, pixelCrop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        'newFile.jpeg',
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }


  render() {
    const { crop, croppedImageUrl, src } = this.state;
    return (
      <div>
        <div>

          {src ? 
            <ReactCrop
              src={src}
              crop={crop}
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          :
          <div>Loading</div>
          }
        </div>
        {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}



        <button onClick={this.squareRatio}>Carré</button>

      </div>
    )
  }

}


function mapStateToProps({ uploadFile }) {
  return {
    uploadFile
  };
}


export default withRouter(connect(mapStateToProps)(CropImage))