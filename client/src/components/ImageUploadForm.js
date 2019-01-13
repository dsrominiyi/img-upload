import React, { Component } from 'react';
import PayPalCheckout from './PayPalCheckout';
import DeleteCross from './svg/DeleteCross';
import LoadingSpinner from './img/LoadingSpinner';

class ImageUploadForm extends Component {

  state = {
    imageCount: 1,
    name: '',
    email: '',
    selectedFiles: [],
    uploading: false
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

  handleSelectedFiles = files => {
    const { selectedFiles, imageCount } = this.state;
    const selectedFileNames = selectedFiles.map(file => file.name);

    Array.from(files).forEach(file => {
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

  onPaymentSuccess = payment => {
    console.log('PAYMENT DUN!!');
    console.log(payment);
  }

  upload = async (e) => {
    e.preventDefault();

    const { name, email, selectedFiles, imageCount } = this.state;
    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);
    formData.append('imageCount', imageCount);
    formData.append('cost', JSON.stringify(this.calculateCost()));

    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      await fetch('http://localhost:6307/upload', { body: formData, method: 'post' });
    } catch (err) {
      console.error(err);
    }

    this.setState({ uploading: false });
  }

  renderFileList = () => {
    const { imageCount, selectedFiles } = this.state;
    const fileList = [];
    for (let i = 0; i < imageCount; i++) {
      const file = selectedFiles[i];
      fileList.push(
        <div className={`fileItem ${file ? 'selected' : 'unselected'}`} key={i}>
          {file ? file.name : <em>{`Add File ${i + 1}`}</em>}
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
    const { imageCount, name, email, uploading } = this.state;

    const { total, pricePerImg } = this.calculateCost();

    return (
      <form>
        <h2>3D Parallax - Submit Your Order</h2>

        <div className="box">
          <div className="row">
            <div className="left">
              <h3>Customer Details</h3>

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

            <div className="right">
              <h3>Order Details</h3>

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
                    (_, i) => i + 1
                  ).map((number, i) => <option value={number} key={i}>{number}</option>)
                }
              </select>
              <p>Cost: £{total} <span>(£{pricePerImg.toFixed(2)} per image)</span></p>
              <PayPalCheckout total={total} onSuccess={this.onPaymentSuccess} />

              <label htmlFor="images" id="imagesUpload">Files</label>
              <input
                ref={fileSelector => this.fileSelector = fileSelector}
                style={{ display: 'none' }}
                type="file"
                name="imagesUpload"
                accept="image/*"
                onChange={e => this.handleSelectedFiles(e.target.files)}
                multiple
              />
              <input type="button" id="fileSelector" value="Add files" onClick={e => this.fileSelector ? this.fileSelector.click() : null} />

              {this.renderFileList()}


              {
                uploading
                  ? <LoadingSpinner />
                  : (
                    <button onClick={e => { this.setState({ uploading: true }, () => this.upload(e)); }}>
                      Upload Files
                    </button>
                  )
              }

            </div>
          </div>

        </div>

      </form>
    );
  }

}

export default ImageUploadForm;