const {codeTranslator} = require('./utils/status');

class throwError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const sendError = (err, res) => {
  const { statusCode, message } = err;

  const code = codeTranslator[statusCode];

  res.status(statusCode).json({
    'err': {
      code,
      message,
    }
  });
};

module.exports = {
  throwError,
  sendError,
};
