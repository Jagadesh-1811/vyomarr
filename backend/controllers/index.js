const postController = require('./postController');
const feedbackController = require('./feedbackController');
const subscriberController = require('./subscriberController');
const whatIfController = require('./whatIfController');
const userController = require('./userController');
const commentController = require('./commentController');

module.exports = {
  ...postController,
  ...feedbackController,
  ...subscriberController,
  ...whatIfController,
  ...userController,
  ...commentController
};
