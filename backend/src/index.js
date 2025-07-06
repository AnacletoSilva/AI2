const express = require('express');
const app = express();
const playerRoute = require('./routes/playerRoute');
const teamRoute = require('./routes/teamRoute');
app.set('port', process.env.PORT||8080);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type,Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', playerRoute);
app.use('/team', teamRoute);

app.listen(app.get('port'), () => {
    console.log("Start server on port " + app.get('port'));
})