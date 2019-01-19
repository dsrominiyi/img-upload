import React, { Component } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import PayPalCheckout from './PayPalCheckout';
import DeleteCross from './svg/DeleteCross';
import LoadingSpinner from './svg/LoadingSpinner';

import { apiUrl } from '../config.json';

class ImageUploadForm extends Component {

  state = {
    imageCount: 1,
    name: '',
    email: '',
    selectedFiles: [],
    paid: false,
    uploading: false,
    notification: false,
    uploaded: false
  };

  MAX_IMAGES = 10;
  ERROR_PAY_FIRST = 'Once payment has been made image upload will be available';
  ERROR_DETAILS_REQUIRED = 'You must enter your name & email before uploading';
  ERROR_SELECT_IMAGES = 'You must select all your images before uploading';
  ERROR_FILE_SIZE = 'Images must be 5MB or less';
  SUCCESS_PAYMENT = 'You may now upload your images';
  SUCCESS_UPLOAD = 'Your images have been uploaded. You will receive an email notification when your order is complete';

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
    let sizeLimitBreach = false;

    Array.from(files).forEach(file => {
      const newFile = selectedFileNames.indexOf(file.name) === -1;
      const belowSizeLimit = (file.size <= 5242880);

      if (newFile && belowSizeLimit) {
        selectedFiles.push(file);
      }
      if (!belowSizeLimit) {
        sizeLimitBreach = true;
      }
    });

    if (selectedFiles.length > imageCount) {
      selectedFiles.splice(imageCount);
    }

    this.fileSelector.value = ''; // clears element's FileList
    this.setState(
      { selectedFiles },
      () => {
        if (sizeLimitBreach) {
          this.notification('error', this.ERROR_FILE_SIZE, 'File Size');
        }
      }
    );
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
    this.setState(
      { paid: true },
      () => this.notification('success', this.SUCCESS_PAYMENT, 'Payment Made')
    );
  }

  notification = (type, message, title, timeOut = 5000, priority = false) => {
    const { notification } = this.state;

    if (!notification || notification !== title || priority) {
      this.setState({ notification: title }, () => {
        const timer = setTimeout(() => this.setState({ notification: false }), timeOut);
        NotificationManager[type](
          message,
          title,
          timeOut,
          () => this.setState({ notification: false }, () => clearTimeout(timer)),
          priority
        );
      });
    }
  }

  tryUpload = e => {
    e.preventDefault();
    const { paid, name, email, selectedFiles, imageCount } = this.state;

    if (!paid) {
      return this.notification('error', this.ERROR_PAY_FIRST, 'Payment Required');
    } else if (!name || !email) {
      return this.notification('error', this.ERROR_DETAILS_REQUIRED, 'Details Required');
    }
    if (selectedFiles.length !== parseInt(imageCount)) {
      return this.notification('error', this.ERROR_SELECT_IMAGES, 'Select Your Images');
    }
    this.setState({ uploading: true }, () => this.upload());
  }

  upload = async () => {
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
      await fetch(`${apiUrl}/upload`, { body: formData, method: 'post' });
    } catch (err) {
      console.error(err);
    }

    this.setState(
      { uploading: false, uploaded: true },
      this.notification('success', this.SUCCESS_UPLOAD, 'Files Uploaded', 10000, true)
    );
  }

  renderFileList = () => {
    const { imageCount, selectedFiles } = this.state;
    const fileList = [];
    for (let i = 0; i < imageCount; i++) {
      const file = selectedFiles[i];
      fileList.push(
        <div className={`fileItem ${file ? 'selected' : 'unselected'}`} key={i}>
          {file ? file.name : `Add Image ${i + 1}`}
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
    const { imageCount, name, email, paid, uploading, uploaded } = this.state;

    const { total, pricePerImg } = this.calculateCost();

    return (
      <form>
        <h2>3D Parallax<br />Submit Your Order</h2>

        {
          uploaded
            ? <div className="box"><h1>Order Submitted</h1></div>
            : (
              <div className="box">
                <h3>1: Enter Order Details And Make Payment</h3>
                <div className="row">
                  <div className="rowItem">
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
                  <div className="rowItem">
                    <label htmlFor="imageCount" id="imageCountLabel">Number of images</label>
                    <select
                      id="imageCount"
                      name="imageCount"
                      value={imageCount}
                      onChange={e => this.updateImageCount(e.target.value)}
                      disabled={paid}
                      className={paid && 'disabled'}
                    >
                      {
                        Array.from(
                          Array(this.MAX_IMAGES),
                          (_, i) => i + 1
                        ).map((number, i) => <option value={number} key={i}>{number}</option>)
                      }
                    </select>
                    <label>
                      <em>Cost: £{total} {imageCount > 1 && <span>(£{pricePerImg.toFixed(2)} per image)</span>}</em>
                    </label>
                    {!paid && <PayPalCheckout total={total} onSuccess={this.onPaymentSuccess} />}
                  </div>
                </div>

                <h3>2: Upload Your Images</h3>
                <div className="row">
                  <input
                    ref={fileSelector => this.fileSelector = fileSelector}
                    style={{ display: 'none' }}
                    type="file"
                    name="imagesUpload"
                    accept="image/*"
                    onChange={e => this.handleSelectedFiles(e.target.files)}
                    multiple
                  />
                  <button
                    id="fileSelectorBtn"
                    onClick={e => this.fileSelector ? this.fileSelector.click(e.preventDefault()) : null}
                  >
                    Add Images
                  </button>
                </div>

                <div className="fileList">{this.renderFileList()}</div>

                <div className="centered">
                  {
                    uploading
                      ? <LoadingSpinner />
                      : (
                        <button
                          onClick={this.tryUpload}
                          className={!paid ? 'disabled' : ''}
                          id="uploadFilesBtn"
                        >
                          Upload Images
                        </button>
                      )
                  }
                </div>
              </div>
            )
        }

        <NotificationContainer />
      </form>
    );
  }

}

export default ImageUploadForm;