const { MongoClient } = require("mongodb");

let cachedClient = null;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing MONGO_URI environment variable" }),
    };
  }

  const data = JSON.parse(event.body || "{}");

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await cachedClient.connect();
    }

    const db = cachedClient.db("techsociety"); // change "techsociety" if you used another DB name
    const collection = db.collection("users");

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
  }
};
