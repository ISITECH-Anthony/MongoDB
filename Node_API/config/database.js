import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB);

export { client, db };