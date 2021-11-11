const { coursesTable } = require('./helpers/airtable');
const { requireAuth } = require('../lib/auth');

exports.handler = requireAuth(async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { id } = JSON.parse(event.body);
  try {
    const deletedCourse = await coursesTable.destroy([id]);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        deletedItem: deletedCourse,
        message: 'Course deleted!',
      }),
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
});
