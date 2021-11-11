const UserConnection = require('../data/UserConnection');
const { requireScope } = require('../lib/auth');

exports.handler = requireScope(
  'read:users',
  async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      const User = await UserConnection.createConnection();
      const users = await User.find();
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({ users }),
      });
    } catch (err) {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: err,
        }),
      });
    }
  }
);
