// database.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://kaanozknn:Hahasanta00@fincafe.p2kfgg3.mongodb.net/?retryWrites=true&w=majority&appName=FINCafe";
const client = new MongoClient(uri);

// ... (rest of the file remains the same)
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

function getDatabase() {
    return client.db("cafe_menu_db");
}

module.exports = { connectToDatabase, getDatabase };