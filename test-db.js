const db = require("./db/db");

db.raw("SELECT 1")
  .then(() => {
    console.log("✅ Conexão OK");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro na conexão:", err);
    process.exit(1);
  });