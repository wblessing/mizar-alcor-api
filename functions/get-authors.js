const { authorsTable } = require('./helpers/airtable');
const { requireAuth } = require('../lib/auth');

exports.handler = requireAuth(async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const authors = await authorsTable.select().firstPage();
    const formattedAuthors = authors.map((author) => ({
      id: author.id,
      ...author.fields,
    }));

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(formattedAuthors),
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
