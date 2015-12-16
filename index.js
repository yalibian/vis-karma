var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

var handlebars = require('express3-handlebars')
    .create({defaultLayout: 'main'});

var session = require('express-session');
var cookieParser = require('cookie-parser');


var bodyParser = require('body-parser');
var multer = require('multer');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(multer());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.render('home');
});


var fortunes = ["Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple."];

app.get('/about', function (req, res) {
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune: randomFortune});
});


app.post("/login", function (req, res) {
    console.log("用户名称为：" + req.body.username);
    //console.log(req);
    res.render('dashboard')
});

// 404 catch-all 处理器（中间件）
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});

// 500 错误处理器（中间件）
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});