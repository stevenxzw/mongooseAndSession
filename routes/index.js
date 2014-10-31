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
        sessionObj = require('./../common/session').sessoin,
        mongo = require('mongoose'),
        config = require('./../config/config');
        commonDao = require('./../Dao/commonDao'),
        mongoose = require('./../common/mongoose');




    var routes = {
		'/setsession' : function(req, res){
            var cookie = sessionObj.setSession(req, res, 'test');
			res.send(cookie.sid);
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
            res.render('index', {
                title : 'angularjs'
            });
            return;
            var PersonModel = conn.db.model('Person',mongoose.person);
            var persons = new commonDao(PersonModel);
            persons.countByQuery({'name':RegExp(req.query.n)}, function(err, rs){
                res.render('index', {
                    title : 'session',
                    session : rs
                });
                //persons.getAll(function(err, rs){
                //res.send(rs);
                //})

            });
            //res.send(req.query.n);
            return
            persons.create({name:'Krouky:'+(+new Date), 'age':12, attr : {h :100, w:134}}, function(err){
                if(!err){
                    persons.countByQuery({'name':'^K' }, function(err, rs){
                        res.render('index', {
                            title : 'session',
                            session : rs
                        });
                        //persons.getAll(function(err, rs){
                            //res.send(rs);
                        //})

                    });

                }
            });

            return;
            //http://www.oschina.net/code/snippet_698737_17103
            PersonModel.findByName('krouky',function(err,persons){
                console.log(persons);
                res.render('index', {
                    title : 'session',
                    session : persons
                });
                //找到所有名字叫krouky的人
            });
            return;
            var personEntity = new PersonModel({name:'Krouky:'+(+new Date), 'age':12, attr : {h :100, w:134}});

            personEntity.speak();
            personEntity.save(function(){
                res.render('index', {
                    title : 'session',
                    session : personEntity.name
                });
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

        /*-------------------管理后台-------------------------------*/
        '/admin' : [false, function(req, res){
            var items  = _util.extend(config.config.adminOpt.items);
            console.log(items);
            items[0].cls = 'active';
            res.render('admin', {
                title : 'Admin',
                items : items
            });
        }],

        '/admin/users' : [false, function(req, res){
            var items  = _util.extend(config.config.adminOpt.items);
            console.log(items);
            items[1].cls = 'active';
            res.render('admin', {
                title : 'Admin',
                items : items
            });
        }],
        '/from' : function(req, res){
            console.log(req);
        }


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
