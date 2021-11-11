var Airtable = require('airtable');
require('dotenv').config();

var base = new Airtable({ apiKey: process.env.FUNC_AIRTABLE_API_KEY }).base(
  process.env.FUNC_AIRTABLE_BASE_ID
);
const authorsTable = base(process.env.FUNC_AIRTABLE_AUTHORS_TABLE);
const coursesTable = base(process.env.FUNC_AIRTABLE_COURSES_TABLE);

module.exports = { coursesTable, authorsTable };
