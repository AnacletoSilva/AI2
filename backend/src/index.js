require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Adicione esta linha
const app = express();
const playerRoute = require('./routes/playerRoute');
const teamRoute = require('./routes/teamRoute');
const sequelize = require('./models/database');

app.set('port', process.env.PORT || 8080);

// Configuração PROFISSIONAL de CORS
app.use(cors({
  origin: function (origin, callback) {
    // Lista de origens permitidas
    const allowedOrigins = [
      'https://ai2-2.onrender.com', // Substitua pelo seu URL real
      'http://localhost:3000' // Para desenvolvimento
    ];
    
    // Permitir requisições sem origem (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `🚫 A política CORS não permite acesso de ${origin}`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (útil para depuração)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/', playerRoute);
app.use('/team', teamRoute);

// Função para verificar e sincronizar o banco de dados
const initializeDB = async () => {
  try {
    // 1. Autenticar com o banco de dados
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida!');
    
    // 2. Verificar se a tabela 'teams' já existe
    const [teamsExist] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' 
        AND tablename = 'teams'
      );
    `);
    
    // 3. Sincronizar apenas se a tabela não existir
    if (!teamsExist[0].exists) {
      console.log('🔄 Tabelas não encontradas. Sincronizando...');
      await sequelize.sync();
      console.log('🔄 Tabelas sincronizadas com sucesso!');
    } else {
      console.log('ℹ️ Tabelas já existem. Pulando sincronização.');
    }
  } catch (error) {
    console.error('❌ Erro na inicialização do banco de dados:', error);
    // Encerrar o processo se o banco não conectar
    process.exit(1);
  }
};

// Inicializar o banco de dados e iniciar o servidor
initializeDB().then(() => {
  const server = app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${app.get('port')}`);
    console.log(`🌐 URL: http://0.0.0.0:${app.get('port')}`);
  });

  // Tratamento de erros não capturados
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Porta ${app.get('port')} já está em uso!`);
    } else {
      console.error('❌ Erro no servidor:', error);
    }
    process.exit(1);
  });
});

// Rota de teste aprimorada
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'backend',
    database: 'connected',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota de fallback para 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// Middleware de erro centralizado
app.use((err, req, res, next) => {
  console.error('🔥 Erro:', err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message,
    timestamp: new Date()
  });
});