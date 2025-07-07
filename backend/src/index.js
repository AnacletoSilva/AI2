require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const playerRoute = require('./routes/playerRoute');
const teamRoute = require('./routes/teamRoute');
const sequelize = require('./models/database');

const app = express();
app.set('port', process.env.PORT || 8080);

// 1) CORS & parsers (antes de qualquer rota)
app.use(cors({
  origin: [
    'https://ai2-2.onrender.com', // domínio do front-end em produção
    'http://localhost:3000'      // desenvolvimento
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-API-KEY'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 3) Endpoint de login admin
app.post('/auth/admin-login', async (req, res) => {
  const { password } = req.body;
  console.log('> admin-login password:', password);
  try {
    const { rows } = await pool.query(
      'SELECT password_hash FROM admins WHERE id = $1',
      [1]
    );
    if (rows.length === 0) {
      return res.status(500).json({ success: false, message: 'Admin não configurado' });
    }

    const hash = rows[0].password_hash;
    const match = await bcrypt.compare(password, hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Senha incorreta' });
    }
    return res.json({ success: true });

  } catch (err) {
    console.error('Erro no admin-login:', err);
    return res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// 4) Rotas da aplicação
app.use('/', playerRoute);
app.use('/team', teamRoute);

// 5) Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'backend',
    database: 'connected',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 6) Fallback 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// 7) Middleware de erro centralizado
app.use((err, req, res, next) => {
  console.error('🔥 Erro:', err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message,
    timestamp: new Date()
  });
});

// 8) Inicializar DB e arrancar servidor
const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida!');

    const [teamsExist] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'teams'
      );
    `);

    if (!teamsExist[0].exists) {
      console.log('🔄 Tabelas não encontradas. Sincronizando...');
      await sequelize.sync();
      console.log('🔄 Tabelas sincronizadas com sucesso!');
    } else {
      console.log('ℹ️ Tabelas já existem. Pulando sincronização.');
    }
  } catch (error) {
    console.error('❌ Erro na inicialização do banco de dados:', error);
    process.exit(1);
  }
};

initializeDB().then(() => {
  const server = app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${app.get('port')}`);
    console.log(`🌐 URL: http://0.0.0.0:${app.get('port')}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Porta ${app.get('port')} já está em uso!`);
    } else {
      console.error('❌ Erro no servidor:', error);
    }
    process.exit(1);
  });
});
