const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);

  try {
    await client.connect();
    const db = client.db("FormInputs"); // Change to your DB name if needed
    const collection = db.collection("Trial1");

    await collection.insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User info saved successfully." }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    await client.close();
  }
};