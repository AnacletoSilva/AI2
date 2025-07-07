const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Adicione para ambientes de produção
  }
});

// Teste de conexão
pool.query('SELECT NOW()', (err) => {
  if (err) console.error('❌ Erro DB:', err);
  else console.log('✅ Conectado ao PostgreSQL');
});

module.exports = pool;