const config = require('../config');

function handleError(errorCode) {
  switch (errorCode) {
    case config.error_code.permission_denied:
      return config.error_msg.permission_denied;
      break;

    default:
      break;
  }
}

module.exports = {
  handleError,
};
