const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const pool = require("./config/database");

const app = express();

(async () => {
  try {
    await pool.connect();

    const dropUserTableQuery = `DROP TABLE IF EXISTS users;`;

    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255)
        );
      `;

    await pool.query(dropUserTableQuery);

    await pool.query(createUserTableQuery);

    console.log("데이터베이스 연결 및 테이블 생성 완료");

    app.use(
      "/graphql",
      graphqlHTTP({
        schema: schema,
        graphiql: true,
      })
    );

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
})();