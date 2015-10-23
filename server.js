var express  = require('express');
var app      = express();                               // aplicação express
var mongoose = require('mongoose');                     // mongoose para mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuração do server

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // conexão do mongo

app.use(express.static(__dirname + '/public'));                 
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// Modelo (futuramente separar em outro arquivo)
var Todo = mongoose.model('Todo', {
    text : String,
    level : { type : Number, default: 1 }
});

//Rotas server, separar para outro arquivo futuramente

//Pegar todos
app.get('/api/todos', function(req, res) {

    // find do mongoose para fazer o select
    Todo.find(function(err, todos) {
        if (err)
            res.send(err)

        res.json(todos);
    });
});

//criação dos dados
app.post('/api/todos', function(req, res) {

    // os dados de criação vem via ajax do angular
    Todo.create({
        text : req.body.text,
        level : req.body.level,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        //após criar, retorna novamente todos os dados
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});

// deleta um todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        //após criar, retorna novamente todos os dados
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

//rota inicial
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

//inicia o servidor
var port = process.env.PORT || 8080;
app.listen(port);
console.log("Servidor iniciado na porta:" + port);

