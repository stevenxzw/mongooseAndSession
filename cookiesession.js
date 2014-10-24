var express = require('express')
var session = require('express-session')

var app = express()
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(session({secret: 'keyboard cat',
    key : 'mycookie',
	cookie: {path: '/', maxAge: 1000*60*2, rolling : true  }
}))


app.use(function (req, res, next) {

    if(req.session['resetSession']){
        req.session['resetSession'] = +new Date;
    }
  next();
});

			app.get('/g', function (req, res, next) {
				req.session.login = 1;
                req.session['resetSession'] = +new Date;
				res.send("/g");
				//next();
			});
			
			app.get('/u', function (req, res, next) {
				//req.session.login = '';
				res.send("/u"+req.session.login);
				//next();
			});

			app.get('/', function (req, res, next) {
				//console.log(req.session);
                res.cookie('username2', '222', {maxAge:100000, path:  '/'});
				if(!req.session.login){
					res.send("unlogin");
				}else{
					res.send("login");
				}
				//next();
			});

			app.get('/get', function (req, res, next) {
				req.session.login = 1;
				res.send("/get:"+req.session.login);
				//next();
			});
			

app.listen(3000)