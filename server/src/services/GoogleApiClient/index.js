import fs from 'fs';
import { google } from 'googleapis';

const creds = require('./creds.json');

class GoogleApiClient {

  jwtClient;

  constructor() {
    this.jwtClient = new google.auth.JWT(
      creds.client_email,
      null,
      creds.private_key,
      ['https://www.googleapis.com/auth/drive']
    );
  }

  authorise = async () => {
    const auth = new google.auth.JWT(
      creds.client_email,
      null,
      creds.private_key,
      ['https://www.googleapis.com/auth/drive']
    );

    await auth.authorize();
    console.log('Google API Client connected!');

    return auth;
  }

  uploadFiles = async (folderName, files, detailsFile) => {
    const auth = await this.authorise();
    const drive = google.drive({ version: 'v3', auth });

    // Create directory
    const folder = await drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [creds.dir_parent_id]
      },
      fields: 'id'
    });

    // Upload images
    for (const file of files) {
      const { name, path } = file;
      const fileExt = name.split('.')[1];
      const mimeType = `image/${fileExt}`;

      const res = await drive.files.create({
        resource: {
          name,
          parents: [folder.data.id]
        },
        media: {
          mimeType,
          body: fs.createReadStream(path)
        }
      });
      console.log(res.data);
    }

    // Upload details file
    const res = await drive.files.create({
      resource: {
        name: 'customer_details.txt',
        parents: [folder.data.id]
      },
      media: {
        mimeType: 'text/plain',
        body: fs.createReadStream(detailsFile)
      }
    });
    console.log(res.data);
  }

}

export default GoogleApiClient;