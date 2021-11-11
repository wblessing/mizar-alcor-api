const { coursesTable } = require('./helpers/airtable');
const formattedReturn = require('./helpers/formattedReturn');

exports.handler = async (event) => {
  const { id, ...fields } = JSON.parse(event.body);
  try {
    const updatedCourse = await coursesTable.update([{ id, fields }]);

    const formattedCourse = {
      id: updatedCourse[0].id,
      ...fields,
    };

    return formattedReturn(200, formattedCourse);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};
