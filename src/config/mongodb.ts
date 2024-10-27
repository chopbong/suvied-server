import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { env } from "../config/environment";

let db: Db | null = null;

// Init an client instance to connect to mongodb
const client = new MongoClient(env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connectDb = async () => {
  // Connect to mongodb
  await client.connect();

  // Get the database
  db = client.db(env.DATABASE_NAME);
};

export const getDb = () => {
  if (!db) {
    throw new Error("Database connection is not established");
  }

  // Return the existed database
  return db;
};
