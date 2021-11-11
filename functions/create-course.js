const { coursesTable } = require('./helpers/airtable');
const { requireAuth } = require('../lib/auth');

exports.handler = requireAuth(async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const fields = JSON.parse(event.body);

  try {
    const createdCourse = await coursesTable.create([{ fields }]);

    const formattedCourse = {
      id: createdCourse[0].id,
      ...fields,
    };

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(formattedCourse),
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
