import dotenv from "dotenv";
dotenv.config();
import pg, { PoolConfig } from "pg";

// const isProduction = process.env.NODE_ENV === "production";
console.log(
  "asd process.env stuff in express app",
  process.env.POSTGRES_USER,
  process.env.DB_HOST
);
const connectConfig: PoolConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.DB_PORT),
};

export const client = new pg.Pool(connectConfig);

client.connect();
