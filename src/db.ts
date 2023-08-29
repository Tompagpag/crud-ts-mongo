import * as dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from 'mongodb';

declare var process: {
  env: {
    MONGODB_URI: string;
  };
};


// const { MONGODB_URI = 'mongodb://localhost/todo-api' } = process.env;
const mongoURI : string = process.env.MONGODB_URI;

export const client = new MongoClient(mongoURI);
export const db = client.db();
