const { MongoClient } = require("mongodb");

// MongoDB URI - make sure it's added to your environment variables in Netlify
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

exports.handler = async function (event) {
  // Check if the HTTP method is POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Parse the incoming request body
  const data = JSON.parse(event.body);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("FormInputs"); // Replace with your DB name
    const collection = db.collection("Trial1"); // Replace with your collection name

    // Insert the user data into the "users" collection
    await collection.insertOne(data);

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User info saved successfully." }),
    };
  } catch (err) {
    // Handle any errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    // Ensure to close the connection after the operation
    await client.close();
  }
};