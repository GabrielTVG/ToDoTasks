const {TableClient} = require("@azure/data-tables");
const {v4: uuidv4} = require("uuid");

const connectionString = process.env.AzureWebJobsStorage;
const tableName = "TodoTasks";

module.exports = async function (context, req) {
  try {
    const {title, owner, description} = req.body;

    if (!title || !owner || !description) {
      context.res = {
        status: 400,
        body: "Missing required fields",
      };
      return;
    }

    const client = TableClient.fromConnectionString(connectionString, tableName);
    await client.createTable();

    const entry = {
      partitionKey: "tasks",
      rowKey: uuidv4(),
      title,
      owner,
      description,
      createdAt: new Date().toISOString(),
    };

    await client.createEntity(entry);

    context.res = {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        message: "Entry added",
        rowKey: entry.rowKey
      }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: `Server error: ${err.message}`
    };
  }
};