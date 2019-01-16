import { promises } from 'fs';
import rimraf from 'rimraf';
import GoogleApiClient from './services/GoogleApiClient';

const fs = promises;

export const upload = async (req, res, next) => {

  const { name, email, imageCount, cost } = req.body;
  let { images } = req.files;

  if (images.length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // Upload to server
  const dirName = `${name.replace(/\s/g, '')}_${new Date().getTime()}`;
  const dirPath = `uploads/${dirName}`;
  const detailsFile = `${dirPath}/customer_details.txt`;
  try {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(
      detailsFile,
      `Name: ${name}\nEmail: ${email}\n${imageCount} images ${cost}`
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error: mkdir');
  }

  const errors = [];

  images = images.length ? images : [ images ];
  for (const image of images) {
    try {
      image.path = `${dirPath}/${image.name}`;
      await image.mv(image.path);
    } catch (err) {
      errors.push(err);
    }
  }

  if (errors.length > 0) {
    console.error(errors);
    res.status(500).send('Server error: mv');
  }

  // Upload to Google Drive
  const google = new GoogleApiClient();

  try {
    await google.uploadFiles(dirName, images, detailsFile);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error: google upload');
  }

  // remove directory from server
  rimraf.sync(dirPath);

  return res.status(200).send('Success!');
};