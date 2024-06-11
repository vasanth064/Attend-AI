import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import crypto from 'crypto';

import config from '../config/config';
import logger from '../config/logger';

const orionRequest = async (filename: string, transactionId?: string) => {
  const fileInp = fs.createReadStream(filename);
  const formData = new FormData();
  formData.append('selfie', fileInp);
  if (transactionId) {
    formData.append('enrol', 'yes');
  } else {
    transactionId = crypto.randomBytes(16).toString('hex');
  }
  formData.append('transactionId', transactionId);

  let requestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: config.orion.url,
    headers: {
      'x-api-key': config.orion.apiKey,
      ...formData.getHeaders()
    },
    data: formData
  };

  console.log(requestConfig);
  const response = await axios.request(requestConfig);
  const result = response.data;
  fs.unlink(filename, (err) => {
    if (err) throw err;
  });
  return result;
};

export {
  orionRequest
};
