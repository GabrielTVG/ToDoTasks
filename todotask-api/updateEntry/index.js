const {TableClient} = require("@azure/data-tables");

const connectionString = process.env.AzureWebJobsStorage;
const tableName = "TodoTasks";

module.exports = async function (context, req) {
  try {
    const {rowKey, title, owner, description} = req.body;

    if (!rowKey || !title || !owner || !description) {
      context.res = {
        status: 400,
        body: "Missing required fields",
      };
      return;
    }

    const client = TableClient.fromConnectionString(connectionString, tableName);
    const existing = await client.getEntity("tasks", rowKey);

    const updated = {
      ...existing,
      title,
      owner,
      description,
      updatedAt: new Date().toISOString(),
    };

    await client.updateEntity(updated, "Replace");

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {message: "Entry updated", rowKey}
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: `Server error: ${err.message}`
    };
  }
};