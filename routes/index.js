/**
 * Created by zhiwen on 14-3-19.
 * ·路由
 */
(function(){

    var _debug = global._debug ,
		filter = require('./../common/filter').filter,
		_util = require('./../common/util').util,
        impl = require('./../common/mongoImpl').Impl,
		conn = require('./../common/conn'),
        sessionObj = require('./../common/session').sessoin;




    var routes = {
		'/setsession' : function(req, res){
			//req.session.user = 'session:'+(+new Date);
			//req.session.nameArr = (+new Date);
			//res.cookie('count', req.session.user);
            var cookie = sessionObj.setSession(req, res, 'test');
			res.send(cookie.sid);
			
		},
		'/getsession' : function(req, res){
			res.send('session');
		},
        '/test' :[false, function(req, res){
           res.send('<div>test</div>');
        }],
		
		'/' : [false, function(req, res){
			console.log('-----:');
            res.render('index', {
				title : 'session',
				session : ''
			});
        }]
    }

    var fn = {

        getUri : function(eapp){
            return eapp.route;
        },

        globalRoute : function(eapp){

            eapp.use(function (req, res, next) {
                sessionObj.resetsession(req, res);
                next();
            })
            sessionObj.init();
            var isFilter = true;
            for(var rot in routes){
                var item =  routes[rot], type = _util.getType(item);
                if(isFilter && type === 'array' && item.length && item[0] === true){
                    eapp.get(rot, filter.authorize, item[1]);
                    eapp.post(rot, filter.authorize, item[1]);
                }else{
                    eapp.get(rot, type === 'array' ? item[1] : item);
                    eapp.post(rot, type === 'array' ? item[1] : item);
                }
            }
        },

        templateRouter : function(app){

            app.get('')
        }


    }

    exports.routefn = fn;

})()
