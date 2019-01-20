import React from 'react';
import { render } from 'react-dom';

import ImageUploadForm from './components/ImageUploadForm';

import './style/sass/index.scss';

render(
  <div>
    <div className="header">
      <a href="https://lifeandartmedia.co.uk/" className="site-logo" title="Life and Art Media">
        <img
          className="logo-desktop regular"
          src="https://lifeandartmedia.co.uk/wp-content/uploads/2018/12/Life-and-art-media-small-logo.png"
          alt="Life and Art Media"></img>
      </a>
    </div>
    <div id="form"><ImageUploadForm /></div>
  </div>,
  document.getElementById('root')
);
