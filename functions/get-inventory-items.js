const InventoryItemConnection = require('../data/InventoryItemConnection');
const { requireScope, getUserId } = require('../lib/auth');

exports.handler = requireScope(
  'read:inventory',
  async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      const { claims } = context.identityContext;
      const userId = getUserId(claims);

      const InventoryItem = await InventoryItemConnection.createConnection();
      const items = await InventoryItem.find({
        user: userId,
      });
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(items),
      });
    } catch (err) {
      console.log('the err', err);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: err,
        }),
      });
    }
  }
);
