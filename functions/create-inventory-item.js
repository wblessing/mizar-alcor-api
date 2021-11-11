const InventoryItemConnection = require('../data/InventoryItemConnection');
const { requireScope, getUserId } = require('../lib/auth');

exports.handler = requireScope(
  'write:inventory',
  async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      const { claims } = context.identityContext;
      const userId = getUserId(claims);
      const body = JSON.parse(event.body);

      const InventoryItem = await InventoryItemConnection.createConnection();
      const input = Object.assign({}, body, {
        user: userId,
      });
      const newInventoryItem = new InventoryItem(input);
      await newInventoryItem.save();

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          inventoryItem: newInventoryItem,
          message: 'Inventory item added!',
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
  }
);
