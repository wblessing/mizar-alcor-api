const { coursesTable } = require('./helpers/airtable');
const { requireAuth } = require('../lib/auth');

exports.handler = requireAuth(async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const courses = await coursesTable.select().firstPage();
    const formattedCourses = courses.map((course) => ({
      id: course.id,
      ...course.fields,
    }));

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(formattedCourses),
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
