var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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





// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(cookieParser('andylau'));

app.use(session({
    secret: 'andylau',
	cookie: {maxAge: 1000 * 60 * 2},//30 minute
    url: 'mongodb://127.0.0.1/rms',
	store: new MongoStore({
			
			url: 'mongodb://127.0.0.1/atong'
	})
}));
*/
/*静态文件路径*/
app.use('/public', express.static(path.join(__dirname, 'public')));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var myroute = require('./routes/index').routefn;
myroute.globalRoute(app);

/*

var RedisStore = require('connect-redis')(session);

var redis_ip='127.0.0.1',
    redis_port ='6379' ;

app.use(session({
    secret: 'zhiwen',
    store:  new RedisStore({
        host:   redis_ip,
        ttl : 600,
        port:   redis_port
    })
}));


var RedisSession = require("redis-session");
var rs = new RedisSession(
    {
        //*optional* Default:6379,redis prot
        port:6379,

        //*optional* Defalut:127.0.0.1, redis host
        host:'127.0.0.1',

        //*optional* Default:"rs", 这个模块的redis key前缀
        namespace:"rs",

        //*optional* Default:600,擦除过期session的时间间隔，最少是10
        wipe:600
    }
);
*/




//module.exports = app;
