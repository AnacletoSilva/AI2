require('dotenv').config();
const express = require('express');
const app = express();
const playerRoute = require('./routes/playerRoute');
const teamRoute = require('./routes/teamRoute');
const sequelize = require('./models/database'); // Importa a instância do Sequelize

app.set('port', process.env.PORT || 8080);

// Configuração do CORS (corrigida)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      await sequelize.sync(); // Cria todas as tabelas
      console.log('🔄 Tabelas sincronizadas com sucesso!');
    } else {
      console.log('ℹ️ Tabelas já existem. Pulando sincronização.');
    }
  } catch (error) {
    console.error('❌ Erro na inicialização do banco de dados:', error);
  }
};

// Inicializar o banco de dados e iniciar o servidor
initializeDB().then(() => {
  // Iniciar o servidor na porta configurada, ouvindo em 0.0.0.0
  app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${app.get('port')}`);
  });
});

// Rota de teste simples
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    database: 'connected',
    timestamp: new Date()
  });
});