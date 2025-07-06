require('dotenv').config(); // Adicione no topo para carregar variáveis de ambiente
const express = require('express');
const app = express();
const playerRoute = require('./routes/playerRoute');
const teamRoute = require('./routes/teamRoute');
const sequelize = require('./models/database'); // Importe o sequelize

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
app.use(express.urlencoded({ extended: true })); // Corrigido: { extended: true }

// Rotas
app.use('/', playerRoute);
app.use('/team', teamRoute);

// Sincronizar modelos com o banco de dados e iniciar o servidor
sequelize.sync() // SEM alter: true em produção!
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log("Start server on port " + app.get('port'));
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });