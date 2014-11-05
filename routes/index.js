/**
 * Created by zhiwen on 14-3-19.
 * ·路由
 */
(function(){

    var _debug = global._debug ,
		filter = require('./../common/filter').filter,
		_util = require('./../common/util').util,
        impl = require('./../common/impl').Impl,
		conn = require('./../common/conn'),
        sessionObj = require('./../common/session').sessoin,
        mongo = require('mongoose'),
        config = require('./../config/config');
        commonDao = require('./../Dao/commonDao'),
        mongoose = require('./../common/mongoose');




    var routes = {
		'/initDataBase' : function(req, res){
            mongoose.init(function(){

                res.send('init DB success! ');
            });
		},

		'/getsession' : function(req, res){
			res.send('session');
		},
        '/test' :[false, function(req, res){
            var Cat = mongo.model('Cat', { name: String , test:Number});
            var kitty = new Cat({ name: 'Zildjian','tset':1 });
            kitty.save(function (err) {
                if (err) // ...
                    console.log('meow');
            });
           res.send('<div>test</div>');
        }],
		
		'/' : [false, function(req, res){
            var persons = mongoose.getDao('person');
            persons.getByQuery('',{'name':'','age':''},{limit:5,skip:8}, function(err, rs){
                console.log(rs);
                res.render('index', {
                    title : 'session',
                    session : rs
                });
                //persons.getAll(function(err, rs){
                //res.send(rs);
                //})

            });
        }],

        '/find' : function(req, res){
            //mongoose.person.methos.speak = function(){};
            var PersonModel = conn.db.model('Person',mongoose.person);
            PersonModel.find(function (err, docs) {
                console.log(docs);

                res.send('session');
            });
        },

        '/query' : function(req, res){
            var PersonModel = conn.db.model('Person',mongoose.person);
            var persons = new commonDao(PersonModel);
            persons.getByQuery({'age':{"$gte":13} },'', '', function(err, rs){
                console.log(rs);
                res.send(rs);
            })
        },

        /*-------------------前台-------------------------------*/
        '/login' : [false, function(req, res){
            res.render('login', {
                title : 'Login',
                action : '/Login'
            });
        }],

        /*-------------------管理后台-------------------------------*/
        '/admin' : [false, function(req, res){
            var items = config.config.adminOpt.getItem();
            items[0].cls = 'active';
            res.render('admin', {
                title : 'Admin',
                action : 'admin'
            });
        }],

        '/admin/addusers' : [false, function(req, res){
            var users = mongoose.getDao('users');

            users.create({id:2,name :4}, function(){


            })
        }],

        '/admin/users' : [false, function(req, res){
            console.time("t");
            var items = config.config.adminOpt.getItem();
            items[1].cls = 'active';
            console.timeEnd("t");

            var users = mongoose.getDao('users');
            res.render('admin/users', {
                title : 'User',
                items : items,
                action : 'admin/users'
            });
        }],

        '/admin/charRoom' : [false, function(req, res){
            console.time("t");
            var items = config.config.adminOpt.getItem();
            items[2].cls = 'active';
            console.timeEnd("t");
            res.render('admin', {
                title : 'Admin',
                items : items
            });
        }],


        '/from' : function(req, res){
            console.log(req);
        },

        /*-----------------------API--------------------------*/

        '/Api/users' : [false, function(req, res){
            var users = mongoose.getDao('users');

            users.getByQuery({},'',{limit:5,skip:0}, function(err, rs){

                res.send(rs);

            });

        }],

        '/Api/login' : [false, function(req, res){
            var param = _util.getHttpRequestParams(req);
            if(!param.username  || !param.pwd){
                res.json(_util.resultCollection("请填写帐号密码",'10001'));
            }else{
                impl.login(req, res);
            }

        }],

        '/Api/getRoomList' : [true, function(req, res){
            var charRoom = mongoose.getDao('charRooms');

            charRoom.getByQuery({},'','', function(err, rs){

                res.json(_util.resultCollection(err, '', rs));

            });

        }],

        '/room' : [true, function(req, res){
            res.render('room', {
                title : 'Room'
            });
            return;
            var charRoom = mongoose.getDao('charRooms');

            charRoom.getByQuery({},'','', function(err, rs){
                console.log(rs);
                res.render('room', {
                    title : 'Room',
                    items : rs
                });

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
