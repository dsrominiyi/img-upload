import React, { Component } from 'react';

import DeleteCross from './svg/DeleteCross';

class ImageUploadForm extends Component {

  state = {
    imageCount: 1,
    name: '',
    email: '',
    selectedFiles: []
  };

  MAX_IMAGES = 10;

  calculateCost = () => {
    const { imageCount } = this.state;

    const baseCost = 80;
    const deductionPerImg = 2.50;
    const maxDeductions = 6;
    let deductions = 0;
    let pricePerImg = baseCost;

    for (let i = 0; i < imageCount; i++) {
      if (i == 0) {
        continue;
      }
      if (deductions == maxDeductions) {
        break;
      }
      pricePerImg -= deductionPerImg;
      deductions++;
    }

    return {
      total: pricePerImg * imageCount,
      pricePerImg
    };
  }

  updateImageCount = newCount => {
    const { selectedFiles } = this.state;

    selectedFiles.splice(newCount);

    this.setState({ imageCount: newCount, selectedFiles });
  }

  handleSelectedFiles = e => {
    const { selectedFiles, imageCount } = this.state;
    const selectedFileNames = selectedFiles.map(file => file.name);

    Array.from(e.target.files).forEach(file => {
      const newFile = selectedFileNames.indexOf(file.name) === -1;
      const belowSizeLimit = (file.size <= 5242880);

      if (newFile && belowSizeLimit) {
        selectedFiles.push(file);
      }
    });

    if (selectedFiles.length > imageCount) {
      selectedFiles.splice(imageCount);
    }

    this.fileSelector.value = ''; // clears element's FileList
    this.setState({ selectedFiles });
  }

  removeFile = fileToRemove => {
    const selectedFiles = [];

    this.state.selectedFiles.forEach(file => {
      if (file.name !== fileToRemove) {
        selectedFiles.push(file);
      }
    });

    this.setState({ selectedFiles });
  }

  renderFileList = () => {
    const { imageCount, selectedFiles } = this.state;
    const fileList = [];
    for (let i=0; i<imageCount; i++) {
      const file = selectedFiles[i];
      fileList.push(
        <div className={`fileItem ${file ? 'selected' : 'unselected' }`} key={i}>
          {file ? file.name : <em>{`Add File ${i+1}`}</em>}
          {
            file 
              ? (
                <span
                  className="remove"
                  onClick={e => this.removeFile(file.name)}
                >
                  <DeleteCross />
                </span>
              ) 
              : ''
          }
        </div>
      );
    }

    return fileList;
  }


  render() {
    const { imageCount, name, email } = this.state;

    const { total, pricePerImg } = this.calculateCost();

    return (
      <form>
        <h2>3D Parallax - Submit Your Order</h2>

        <div className="box">
          <div className="row">
            <div className="left">
              <label htmlFor="imageCount" id="imageCountLabel">Number of images</label>
              <select
                id="imageCount"
                name="imageCount"
                value={imageCount}
                onChange={e => this.updateImageCount(e.target.value)}
              >
                { 
                  Array.from(
                    Array(this.MAX_IMAGES), 
                    (_,i) => i+1
                  ).map(number => <option value={number}>{number}</option>) 
                }
              </select>

              <label htmlFor="name" id="nameLabel">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />

              <label htmlFor="email" id="emailLabel">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Your email address"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </div>

            <div className="right align-c">
              <h3>Pricing</h3>
              <p className="larger-text">£{total}</p>
              <p className="larger-text"><span>(£{pricePerImg.toFixed(2)} per image)</span></p>
            </div>
          </div>

          <div className="row">
            <label htmlFor="images" id="imagesUpload">Files</label>
            <input
              ref={ fileSelector => this.fileSelector = fileSelector }
              style={{ display: 'none' }}
              type="file"
              name="imagesUpload"
              accept="image/*"
              onChange={this.handleSelectedFiles}
              multiple
            />
            <input type="button" id="fileSelector" value="Add files" onClick={e => this.fileSelector ? this.fileSelector.click() : null} />
          </div>

          <div className="row">{this.renderFileList()}</div>
        </div>

      </form>
    );
  }

}

export default ImageUploadForm;