const UserConnection = require('../data/UserConnection');
const { requireAuth, getUserId } = require('../lib/auth');

exports.handler = requireAuth(async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const { claims } = context.identityContext;
    const userId = getUserId(claims);
    const User = await UserConnection.createConnection();

    const body = JSON.parse(event.body);
    const { role } = body;
    const allowedRoles = ['user', 'admin'];

    if (!allowedRoles.includes(role)) {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Role not allowed',
        }),
      });
    }

    await User.findOneAndUpdate({ _id: userId }, { role });

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User role updated. Sorry this is not working yet.',
      }),
    });
  } catch (err) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: err,
      }),
    });
  }
});
