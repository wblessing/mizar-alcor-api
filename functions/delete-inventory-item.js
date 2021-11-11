const InventoryItemConnection = require('../data/InventoryItemConnection');
const { requireScope, getUserId } = require('../lib/auth');

exports.handler = requireScope(
  'delete:inventory',
  async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      const { claims } = context.identityContext;
      const userId = getUserId(claims);

      const queryString = event.path;
      const id = queryString.split('/')[2];

      const InventoryItem = await InventoryItemConnection.createConnection();
      const deletedItem = await InventoryItem.findOneAndDelete({
        _id: id,
        user: userId,
      });
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          deletedItem: deletedItem,
          message: 'Inventory item deleted!',
        }),
      });
    } catch (err) {
      console.log(err);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: err,
        }),
      });
    }
  }
);
