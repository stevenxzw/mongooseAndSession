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
        //config = require('./../config/config');
        commonDao = require('./../Dao/commonDao'),
        mongoose = require('./../common/mongoose');



    global.io.sockets.on('connection', function (socket) {
        socket.on('sendComment', function(r, fn){
            impl.updateComment(r, function(err, re){
                if(!err){
                    socket.broadcast.emit('successCommit-'+ r.rid, r);
                }
                fn && fn(err);
            });
            console.log('on-sendComment');
            //fn('success');

        });

    });

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
            var items = global.config.getMenu('admin', 0);
            res.render('admin', {
                title : 'Admin',
                action : 'admin',
                items: items
            });
        }],

        '/admin/addusers' : [false, function(req, res){
            var users = mongoose.getDao('users');

            users.create({id:2,name :4}, function(){


            })
        }],

        '/admin/users' : [false, function(req, res){
            var items = global.config.getMenu('admin', 1);
            var users = mongoose.getDao('users');
            res.render('admin/users', {
                title : 'User',
                items : items,
                action : 'admin/users'
            });
        }],

        '/admin/charRoom' : [false, function(req, res){
            var items = global.config.getMenu('admin', 2);
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

            charRoom.getByQuery({},{id:1,name :1,users:1, createId:1, createTime:1, members:1,nowNum:1,des:1},'', function(err, rs){

                res.json(_util.resultCollection(err, '', rs));

            });

        }],


        '/Api/getRoomUsers' : [true, function(req, res){
            var Users = mongoose.getDao('users');
            var param = _util.getHttpRequestParams(req);
            console.log(param);
            Users.getByQuery({id:{ $in: param.users }},'','', function(err, rs){

                res.json(_util.resultCollection(err, '', rs));

            });

        }],

        '/Api/getRoomChars' : [true, function(req, res){
            var chars = mongoose.getDao('chars');
            var param = _util.getHttpRequestParams(req);
            console.log(param);
            var find = param.find || {id:param.id},
                opt = param.opt ||{limit : 1, skip:0} ;
            chars.getByQuery(find,'',opt, function(err, rs){

                res.json(_util.resultCollection(err, '', rs));

            });

        }],

        /*--------------- API 结束 ------------------------------*/

        '/roomlist' : [true, function(req, res){
            var items = global.config.getMenu('front', 1);
            res.render('roomlist', {
                title : 'roomlist',
                items : items
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

        }],

        '/room/?:id' : [true, function(req, res){
            var items = global.config.getMenu('front', 1);
            var params = _util.getHttpRequestParams(req);

            var charRoom = mongoose.getDao('charRooms');
            if(params.id){
                params.userid = _util.getSession(req, 'userid');
                params.username = _util.getSession(req, 'username');
                charRoom.getByQuery({id:params.id},{id:1,name :1,users:1, createId:1, createTime:1, members:1,nowNum:1,des:1},'', function(err, rs){
                    res.render('room', {
                        title : 'room',
                        items : items,
                        action : '/room',
                        content : JSON.stringify({p:params,r:rs})
                    });
            });
            }else{

                res.send('');
            }

            return;
            var charRoom = mongoose.getDao('charRooms');

            charRoom.getByQuery({},'','', function(err, rs){
                console.log(rs);
                res.render('room', {
                    title : 'Room',
                    items : rs
                });
            });

        }],

        '/' : [true, function(req, res){
            var items = global.config.getMenu('front', 0);
            res.render('index', {
                title : 'Home',
                items : items
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
