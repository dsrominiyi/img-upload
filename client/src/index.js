import React from 'react';
import { render } from 'react-dom';

import ImageUploadForm from './components/ImageUploadForm';

import './style/sass/index.scss';

render(
  <div id="form">
    <ImageUploadForm />
  </div>,
  document.getElementById('root')
);
