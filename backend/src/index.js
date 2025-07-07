require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Adicionado
const pool = require('./db');
const playerRoute = require('./routes/playerRoute');
const teamRoute = require('./routes/teamRoute');
const sequelize = require('./models/database');

const app = express();
app.set('port', process.env.PORT || 8080);

// 1) CORS & parsers
app.use(cors({
  origin: [
    'https://ai2-2.onrender.com',
    'http://localhost:3000'
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

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token não fornecido' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token mal formatado' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbackSecret');
    req.adminData = decoded;
    next();
  } catch (error) {
    console.error('🔥 Erro no middleware de autenticação:', error);
    return res.status(401).json({
      success: false,
      message: 'Autenticação falhou'
    });
  }
};

// 3) Endpoint de login admin (modificado)
app.post('/auth/admin-login', async (req, res) => {
  const { password } = req.body;
  console.log('> admin-login password:', password);
  
  try {
    // Verificação adicional do pool
    if (!pool) {
      console.error('Pool de conexão não inicializado!');
      return res.status(500).json({ 
        success: false, 
        message: 'Erro de configuração do servidor' 
      });
    }

    const { rows } = await pool.query(
      'SELECT password_hash FROM admins WHERE id = $1',
      [1]
    );
    
    console.log(`Resultado da query: ${rows.length} linhas`);

    if (rows.length === 0) {
      console.warn('Admin não encontrado na base de dados');
      return res.status(500).json({ 
        success: false, 
        message: 'Admin não configurado' 
      });
    }

    const hash = rows[0].password_hash;
    console.log('Hash recuperado do banco:', hash ? '***' : 'vazio');
    
    const match = await bcrypt.compare(password, hash);
    console.log('Resultado da comparação de senha:', match);
    
    if (!match) {
      return res.status(401).json({ 
        success: false, 
        message: 'Senha incorreta' 
      });
    }
    
    // Gera token JWT
    const token = jwt.sign(
      { adminId: 1 },
      process.env.JWT_SECRET || 'fallbackSecret',
      { expiresIn: '1h' }
    );
    
    return res.json({ success: true, token });
    
  } catch (err) {
    console.error('🔥 ERRO CRÍTICO no admin-login:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro no servidor',
      error: err.message 
    });
  }
});

// Rota protegida para painel admin
app.get('/admin/dashboard', authMiddleware, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Bem-vindo ao painel de administração!',
    adminId: req.adminData.adminId 
  });
});

// Endpoint de teste do banco de dados
app.get('/test-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM admins');
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error('Erro ao testar o banco de dados:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
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