import { MongoClient } from 'mongodb';

// const { MONGODB_URI = 'mongodb://localhost/todo-api' } = process.env;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/todo-api';

export const client = new MongoClient(mongoURI);
export const db = client.db();
