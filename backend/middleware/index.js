const { upload, postUpload, singleImageUpload } = require('./upload');
const { errorHandler, notFound } = require('./errorHandler');

module.exports = {
  upload,
  postUpload,
  singleImageUpload,
  errorHandler,
  notFound
};
