const data = require('../data/dashboard');
const { requireAuth } = require('../lib/auth');

exports.handler = requireAuth(async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  } catch (err) {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        error: err,
      }),
    });
  }
});
