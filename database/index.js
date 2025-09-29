// database/index.js
const { Pool } = require("pg");
require("dotenv").config();

const connStr =
  process.env.DATABASE_URL ||
  (process.env.DB_USER &&
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${
      process.env.DB_HOST
    }:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`);

const isProd = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: connStr,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      if (!isProd) console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("DB query error:", { text, error: error.message });
      throw error;
    }
  },
};
