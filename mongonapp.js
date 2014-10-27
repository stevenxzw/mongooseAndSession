var express = require('express')
var session = require('express-session')
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
app.use(cookieParser())

app.use(session({secret: 'keyboard cat',
    key : 'mycookie',
    cookie: {path: '/', maxAge: 1000*60*2, rolling : true  }
}))

var connect = require('connect');
var http = require('http');
var path = require('path');
var app = express();

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

global.config = require('./config/config').config;
if (process.env.PORT) {//生产环境
    global._debug = false;
    global._local = false;
}else{// 开发环境
    //app.use(express.errorHandler());
    global._debug = true;//测试状态
    global._local = true;//本地开发
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*静态文件路径*/
app.use('/public', express.static(path.join(__dirname, 'public')));


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var myroute = require('./routes/index').routefn;
myroute.globalRoute(app);


app.listen(3001)