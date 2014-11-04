/**
 * Created by zhiwen on 14-10-27.
 */

(function(){

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        _util = require('./../common/util'),
        conn = require('./../common/conn'),
        commonDao = require('./../Dao/commonDao'),
    //userSchema
    userSchema = new Schema({
        id : Number,
        name:String,
        pass : String,
        createTime : { type: Number, default: new Date().getTime() },
        loginTimes : 0
    }),

    //charRoomSchema
     charRoomSchema = new Schema({
        id : Number,
        name:String,
        //createTime : { type: Date, default: Date.now },
         createTime  : { type: Number, default: new Date().getTime()},
         members : Number,
         nowNum : Number
    }),

    //charSchema
    charSchema = new Schema({
        users:String,
        createTime : { type: Date, default: Date.now },
        content : String,
        charRoom :Number
    }),

    tempData = {
        'usersData' : [{id:1,name :'test', pass : '123456', createTime: +new Date, loginTimes : 0, role: 0}
        ,{id:1,name :'admin', pass : '123456', createTime: +new Date, loginTimes : 0, role: 1}],

        'charRoomData' :  [{id:1,name :'testroom',  createTime:1415115093101, members:10,nowNum:1 }],

        'charData' :  [{users:1,content :'--rtets',  createTime: +new Date, charRoom:1}]
    };



    var tables = ['users', 'charRoom', 'char'];

    var PersonSchema = new Schema({
        name:String,   //定义一个属性name，类型为String
        age : Number,
        attr : {}
    });

    PersonSchema.methods.speak = function(){
        console.log(this.name);
    };

    PersonSchema.statics.findByName = function(name,cb){
        this.find({name:new RegExp(name,'i')},cb);
    }


    var BlogSchema = new Schema({
        title:String,
        author:String
    });

    module.exports = {
        users : userSchema,

        charRoom : charRoomSchema,

        char : charSchema,


        person : PersonSchema,

        blog : BlogSchema,


        getDao : function(name){
            if(this[name]){
                return new commonDao(conn.db.model(name,this[name]));
            }else return null;
        },

        //删除所有数据表
        dropAllTable : function(){
            tables = ['users', 'charRoom', 'char', 'people', 'cats'];
            var newTable = _util.util.extend([], tables);
            console.log(tables);
            //for(var table in newTable)
                //conn.db
        },

        init : function(fn){
            if(tables.length){
                this.createTable(tables, function(r){
                    console.log('success');
                    fn && fn();
                });
            }
        },

        createTable : function(ts, fn){

            if(ts.length){
                var item = ts.shift(), that = this;

                var dao = this.getDao(item);

                dao.create(tempData[item+'Data'], function(r){
                    if(r === null){
                        console.log('add dataBase:'+item);
                        that.createTable(ts, fn);
                    }else{
                        console.log('error:'+r);
                    }
                })
            }else{

                fn && fn();
            }

        }
    };

})()